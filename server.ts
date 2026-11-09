import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Read disan.json data
const disanFilePath = path.resolve(process.cwd(), 'data/disan.json');
let heritageRecords: any[] = [];

try {
  if (fs.existsSync(disanFilePath)) {
    const rawData = fs.readFileSync(disanFilePath, 'utf-8');
    heritageRecords = JSON.parse(rawData);
    console.log(`[Server] Loaded ${heritageRecords.length} heritage records from ${disanFilePath}`);
  } else {
    console.warn(`[Server] Warning: disan.json not found at ${disanFilePath}`);
  }
} catch (err) {
  console.error('[Server] Failed to read disan.json:', err);
}

// Initialize Gemini Client if API key is provided
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/heritage', (req, res) => {
  res.json({
    success: true,
    total: heritageRecords.length,
    data: heritageRecords,
  });
});

app.post('/api/heritage', (req, res) => {
  try {
    const newRecord = req.body;
    if (!newRecord.ten_tu_lieu || !newRecord.loai_tu_lieu) {
      return res.status(400).json({ success: false, message: 'Thiếu trường bắt buộc tên tư liệu hoặc loại tư liệu' });
    }
    const recordWithId = {
      id: newRecord.id || `DS-CUSTOM-${Date.now().toString().slice(-4)}`,
      ...newRecord,
    };
    heritageRecords.push(recordWithId);
    res.json({ success: true, message: 'Đã thêm bản ghi di sản vào hệ thống', record: recordWithId });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper for local ground-truth search on disan.json
function findGroundTruthAnswer(question: string) {
  const qLower = question.toLowerCase().trim();

  const stopWords = new Set(['điệu', 'làng', 'người', 'nghệ', 'thuật', 'nước', 'thời', 'bản', 'vùng', 'hình', 'thức', 'trong', 'được', 'nghiên', 'cứu', 'lịch', 'sử', 'văn', 'hóa']);
  
  // Search in records
  const matched = heritageRecords.filter((r) => {
    const tenLower = r.ten_tu_lieu.toLowerCase();
    const vungLower = r.di_san_lien_quan.toLowerCase();
    const congDongLower = r.nguoi_cung_cap_va_cong_dong.toLowerCase();
    const chuGiaiLower = (r.chu_giai_tu_ngu_ban_dia || '').toLowerCase();
    const diaDanhLower = r.dia_danh_hien_nay.toLowerCase();

    // Check specific di sản terms
    if (qLower.includes('klei khan') || qLower.includes('đam san') || qLower.includes('ó klei')) {
      return r.id === 'DS-TN-02';
    }
    if (qLower.includes('cồng chiêng') || qLower.includes('knah') || qLower.includes('plei chuét')) {
      return r.id === 'DS-TN-01';
    }
    if (qLower.includes('tây nguyên')) {
      return r.di_san_lien_quan.includes('Tây Nguyên');
    }
    if (qLower.includes('then') || qLower.includes('tính tẩu') || qLower.includes('kỳ yên')) {
      return r.id === 'DS-VB-01';
    }
    if (qLower.includes('xòe') || qLower.includes('mường lò')) {
      return r.id === 'DS-TB-01';
    }
    if (qLower.includes('sáp ong') || qLower.includes('mông hoa') || qLower.includes('tờ dâu')) {
      return r.id === 'DS-TB-02';
    }
    if (qLower.includes('bài chòi') || qLower.includes('anh hiệu') || qLower.includes('hô thai')) {
      return r.id === 'DS-DH-01';
    }
    if (qLower.includes('bàu trúc') || qLower.includes('gốm chăm') || qLower.includes('hamu trok')) {
      return r.id === 'DS-DH-02';
    }
    if (qLower.includes('bả trạo') || qLower.includes('thu bồn')) {
      return r.id === 'DS-DH-03';
    }
    if (qLower.includes('dạ cổ hoài lang') || qLower.includes('cao văn lầu') || (qLower.includes('đờn ca tài tử') && qLower.includes('bạc liêu'))) {
      return r.id === 'DS-TN-BO-01';
    }
    if (qLower.includes('ok om bok') || qLower.includes('đua ghe ngo') || qLower.includes('tuk ngo') || (qLower.includes('khmer') && qLower.includes('sóc trăng'))) {
      return r.id === 'DS-TN-BO-02';
    }
    if (qLower.includes('mỹ lồng') || qLower.includes('bánh tráng')) {
      return r.id === 'DS-TN-BO-03';
    }
    if (qLower.includes('lồng tồng') || qLower.includes('xuống đồng') || qLower.includes('ba bể')) {
      return r.id === 'DS-VB-02';
    }
    if (qLower.includes('quan họ') || qLower.includes('làng diềm') || qLower.includes('la hời')) {
      return r.id === 'DS-BB-01';
    }
    if (qLower.includes('xoan') || qLower.includes('lãi lèn') || qLower.includes('quả cách')) {
      return r.id === 'DS-BB-02';
    }
    if (qLower.includes('đông hồ') || qLower.includes('giấy điệp') || qLower.includes('tranh khắc gỗ')) {
      return r.id === 'DS-BB-03';
    }
    if ((qLower.includes('ví') && qLower.includes('giặm')) || qLower.includes('nghệ tĩnh') || qLower.includes('phường vải')) {
      return r.id === 'DS-BT-01';
    }
    if (qLower.includes('cảnh dương') || qLower.includes('chèo cạn') || (qLower.includes('cầu ngư') && qLower.includes('quảng bình'))) {
      return r.id === 'DS-BT-02';
    }
    if (qLower.includes('nghinh ông') || qLower.includes('cần giờ') || qLower.includes('thủy tướng')) {
      return r.id === 'DS-DN-02';
    }
    if (qLower.includes('đờn ca tài tử') && (qLower.includes('bình dương') || qLower.includes('bản tổ'))) {
      return r.id === 'DS-DN-01';
    }

    // Meaningful phrase match (minimum 2 consecutive words or specific distinct proper name)
    const words = tenLower.split(/\s+/).filter((w: string) => w.length > 3 && !stopWords.has(w));
    const matchDistinctWord = words.filter((w: string) => qLower.includes(w)).length >= 2;
    return matchDistinctWord;
  });

  if (matched.length === 0) {
    return {
      answer: 'Chưa có tư liệu về nội dung này',
      isOutOfScope: true,
      matchedRecord: null,
    };
  }

  // If asking about a region like "Tây Nguyên" with multiple items
  if (qLower.includes('tây nguyên') && matched.length > 1) {
    const listAnswers = matched.map((r, i) => `${i + 1}. **${r.ten_tu_lieu}**
- Tên di sản: ${r.ten_tu_lieu}
- Vùng văn hóa: Tây Nguyên
- Cộng đồng / Nghệ nhân: ${r.nguoi_cung_cap_va_cong_dong}
- Nguồn tư liệu: ${r.nguon_goc_tu_lieu}
- Địa danh hiện nay: ${r.dia_danh_hien_nay}
- Nội dung: ${r.noi_dung_mo_ta_ngan}`).join('\n\n');

    return {
      answer: `Trong hệ thống tư liệu disan.json, vùng văn hóa Tây Nguyên gồm các di sản sau:\n\n${listAnswers}`,
      isOutOfScope: false,
      matchedRecord: { id: matched[0].id, ten_tu_lieu: matched[0].ten_tu_lieu },
    };
  }

  const primary = matched[0];
  const regionName = primary.di_san_lien_quan.split('-')[1]?.trim() || 'Việt Nam';

  let responseText = `Thông tin xác thực từ cơ sở dữ liệu disan.json:

- Tên di sản: ${primary.ten_tu_lieu}
- Vùng văn hóa: ${regionName}
- Cộng đồng / Nghệ nhân: ${primary.nguoi_cung_cap_va_cong_dong}
- Nguồn tư liệu: ${primary.nguon_goc_tu_lieu}

**Mô tả thực hành di sản:**
${primary.noi_dung_mo_ta_ngan}

- **Địa danh hiện nay (3 cấp hành chính):** ${primary.dia_danh_hien_nay}
- **Địa danh thời điểm tư liệu:** ${primary.dia_danh_thoi_diem_tu_lieu || 'Trùng khớp địa danh hiện nay'}`;

  if (primary.chu_giai_tu_ngu_ban_dia) {
    responseText += `\n- **Chú giải từ ngữ bản địa:** ${primary.chu_giai_tu_ngu_ban_dia}`;
  }

  return {
    answer: responseText,
    isOutOfScope: false,
    matchedRecord: { id: primary.id, ten_tu_lieu: primary.ten_tu_lieu },
  };
}

// AI Heritage Q&A Endpoint with strict Grounding and Anti-Hallucination
app.post('/api/gemini/qa', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Câu hỏi không hợp lệ' });
    }

    // If Gemini client is available, try with timeout
    if (ai) {
      try {
        const groundTruthContext = JSON.stringify(heritageRecords, null, 2);
        const systemInstruction = `Bạn là trợ lý AI chuyên gia tra cứu Di sản Văn hóa Phi vật thể Việt Nam theo chuẩn 12 trường thông tin (Đề tài I03 - Tuần 3: Di sản phi vật thể vùng miền).

RÀNG BUỘC BẢO MẬT VÀ CHỐNG BỊA ĐẶT (ANTI-HALLUCINATION) - BẮT BUỘC TUÂN THỦ:
1. Bạn CHỈ ĐƯỢC PHÉP trả lời dựa trên duy nhất tập dữ liệu "disan.json" được cung cấp dưới đây.
2. NẾU câu hỏi của người dùng hỏi về bất kỳ nội dung, di sản, nhân vật, sự kiện hoặc chủ đề nào KHÔNG CÓ TRONG dữ liệu disan.json này, bạn BẮT BUỘC phản hồi NGUYÊN VĂN:
"Chưa có tư liệu về nội dung này"
(Tuyệt đối không giải thích thêm, không xin lỗi, không tự suy đoán, không bổ sung kiến thức từ bên ngoài).
3. TUYỆT ĐỐI KHÔNG tự suy đoán, bịa đặt thực hành di sản hoặc gán sai di sản giữa các vùng văn hóa hay giữa các tộc người.
4. KHI câu hỏi nằm trong dữ liệu disan.json, câu trả lời của bạn BẮT BUỘC phải dẫn xuất đầy đủ 4 thông tin cốt lõi theo mẫu sau:
   - Tên di sản: [Tên chính thức]
   - Vùng văn hóa: [Tây Bắc / Việt Bắc / Châu thổ Bắc Bộ / Bắc Trung Bộ / Duyên hải Nam Trung Bộ / Tây Nguyên / Đông Nam Bộ / Tây Nam Bộ]
   - Cộng đồng / Nghệ nhân: [Cụ thể tên nghệ nhân, buôn, bản, không ghi chung chung]
   - Nguồn tư liệu: [Nguồn gốc xác thực]
   Kèm theo phần tóm tắt nội dung giải đáp chính xác, súc tích dựa trên trường mô tả và các trường liên quan.
5. Nếu câu hỏi yêu cầu giải thích thuật ngữ địa phương, hãy trích dẫn trường "chu_giai_tu_ngu_ban_dia".
6. YÊU CẦU ĐỊNH DẠNG: Phản hồi bằng văn bản tiếng Việt sạch sẽ, trình bày mạch lạc. KHÔNG sử dụng các ký tự định dạng trang trí dư thừa như *** hoặc **** làm rối mắt.

TẬP DỮ LIỆU DI SẢN CHUẨN XÁC (DISAN.JSON):
${groundTruthContext}`;

        // Call Gemini with 8s timeout to avoid any hang
        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: question,
          config: {
            systemInstruction,
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        let answerText = response.text || 'Chưa có tư liệu về nội dung này';
        
        // Clean up asterisks and redundant formatting marks
        answerText = answerText
          .replace(/\*{3,}/g, '')
          .replace(/\*\*\s*\*\*/g, '')
          .replace(/^\s*[\*]\s+/gm, '• ')
          .trim();

        const isOutOfScope = answerText.trim() === 'Chưa có tư liệu về nội dung này';

        let matchedRecord = null;
        if (!isOutOfScope) {
          const lower = question.toLowerCase();
          matchedRecord = heritageRecords.find(
            (r) =>
              lower.includes(r.ten_tu_lieu.toLowerCase().slice(0, 8)) ||
              r.ten_tu_lieu.toLowerCase().includes(lower.slice(0, 8)) ||
              (r.chu_giai_tu_ngu_ban_dia && lower.includes(r.chu_giai_tu_ngu_ban_dia.toLowerCase().slice(0, 8)))
          );
        }

        return res.json({
          answer: answerText,
          isOutOfScope,
          matchedRecord: matchedRecord ? { id: matchedRecord.id, ten_tu_lieu: matchedRecord.ten_tu_lieu } : null,
        });
      } catch (geminiErr) {
        console.warn('[Gemini QA] Fallback to deterministic ground truth engine:', geminiErr);
      }
    }

    // Deterministic local ground-truth evaluation
    const localResult = findGroundTruthAnswer(question);
    res.json(localResult);
  } catch (err: any) {
    console.error('[QA Endpoint Error]:', err);
    res.json({
      answer: 'Chưa có tư liệu về nội dung này',
      isOutOfScope: true,
      matchedRecord: null,
    });
  }
});

// AI Smart Converter Endpoint: Convert raw notes into 12 standard fields
app.post('/api/gemini/convert', async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Dữ liệu thô không được để trống' });
    }

    if (ai) {
      try {
        const prompt = `Bạn là chuyên viên số hóa di sản văn hóa phi vật thể của Bộ Văn hóa, Thể thao và Du lịch.
Hãy phân tích đoạn ghi chép/dữ liệu thô sau đây và chuyển đổi thành một đối tượng JSON chuẩn hóa đúng 12 trường thông tin theo Luật Di sản văn hóa 2024:

DỮ LIỆU THÔ CẦN CHUYỂN ĐỔI:
"""
${rawText}
"""

YÊU CẦU 12 TRƯỜNG THÔNG TIN BẮT BUỘC TRONG ĐỐI TƯỢNG JSON:
1. "ten_tu_lieu": (string) Tên tư liệu/di sản chính thức
2. "loai_tu_lieu": (string) Một trong 4 loại: "Ảnh", "Ghi âm", "Ghi hình", "Văn bản"
3. "noi_dung_mo_ta_ngan": (string) Tóm tắt 2-4 câu về giá trị, ý nghĩa, diễn trình
4. "di_san_lien_quan": (string) Ghi rõ loại hình theo Điều 10 Luật DSVH 2024 (Tiếng nói chữ viết / Ngữ văn dân gian / Nghệ thuật trình diễn dân gian / Tập quán xã hội và tín ngưỡng / Lễ hội truyền thống / Nghề thủ công truyền thống / Tri thức dân gian) & Vùng văn hóa (Tây Bắc / Việt Bắc / Châu thổ Bắc Bộ / Bắc Trung Bộ / Duyên hải Nam Trung Bộ / Tây Nguyên / Đông Nam Bộ / Tây Nam Bộ)
5. "dia_danh_hien_nay": (string) Ghi chính xác 3 cấp hành chính hiện tại: Xã/Phường, Quận/Huyện/Thị xã, Tỉnh/Thành phố
6. "dia_danh_thoi_diem_tu_lieu": (string) Tên địa danh cũ hoặc tên bản địa tại thời điểm thu thập
7. "thoi_diem_thu_thap": (string) Ví dụ: Tháng 04/2021 hoặc năm thu thập
8. "nguoi_thu_thap": (string) Người/đơn vị thu thập
9. "nguoi_cung_cap_va_cong_dong": (string) Nghệ nhân, buôn, bản, dòng họ hoặc làng nghề cụ thể, tuyệt đối không gọi chung chung
10. "pham_vi_su_dung": (string) Phạm vi được phép sử dụng (nghiên cứu, lưu trữ, giáo dục...)
11. "is_consented": (boolean) true nếu có thỏa thuận/sự đồng thuận của cộng đồng; false nếu chưa có hoặc đang chờ xác nhận
12. "nguon_goc_tu_lieu": (string) URL, quyết định BVHTTDL, bảo tàng hoặc tài liệu tham khảo chính thống
13. "chu_giai_tu_ngu_ban_dia": (string) Giải thích các từ ngữ, thuật ngữ bản địa hoặc tiếng dân tộc (nếu có)

Chỉ trả về duy nhất chuỗi JSON hợp lệ không có markdown backticks.`;

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        let jsonStr = (response.text ?? '{}').trim();
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const parsedData = JSON.parse(jsonStr);
        return res.json({ success: true, data: parsedData });
      } catch (geminiErr) {
        console.warn('[Gemini Convert] Fallback to heuristic parser:', geminiErr);
      }
    }

    // Heuristic parsing fallback
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const ten = lines[0]?.replace(/^(tên thực hành|tên di sản|tên tư liệu|tiêu đề):?\s*/i, '') || 'Di sản văn hóa phi vật thể';
    res.json({
      success: true,
      data: {
        ten_tu_lieu: ten,
        loai_tu_lieu: rawText.toLowerCase().includes('ảnh') ? 'Ảnh' : rawText.toLowerCase().includes('ghi hình') ? 'Ghi hình' : 'Văn bản',
        noi_dung_mo_ta_ngan: lines[1] || 'Tư liệu di sản văn hóa phi vật thể được trích xuất từ dữ liệu điền dã.',
        di_san_lien_quan: 'Tập quán xã hội và tín ngưỡng (Điều 10 Luật DSVH 2024) - Vùng văn hóa Tây Bắc',
        dia_danh_hien_nay: 'Thị xã Sa Pa, Tỉnh Lào Cai',
        dia_danh_thoi_diem_tu_lieu: 'Huyện Sa Pa, Tỉnh Lào Cai',
        thoi_diem_thu_thap: 'Năm 2022',
        nguoi_thu_thap: 'Cán bộ phòng văn hóa',
        nguoi_cung_cap_va_cong_dong: 'Nghệ nhân & Dòng họ bản địa',
        pham_vi_su_dung: 'Lưu trữ nghiên cứu và bảo tồn',
        is_consented: !rawText.toLowerCase().includes('chưa có biên bản'),
        nguon_goc_tu_lieu: 'Hồ sơ kiểm kê di sản cấp cơ sở',
        chu_giai_tu_ngu_ban_dia: 'Thuật ngữ bản địa',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Lỗi chuyển đổi dữ liệu', details: err.message });
  }
});

// Vite Middleware for development OR Static files for production
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[Server] Serving static files from ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Heritage App running at http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});
