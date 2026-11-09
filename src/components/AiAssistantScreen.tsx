import React, { useState } from 'react';
import { HeritageRecord, ChatMessage } from '../types/heritage';
import { GoogleGenAI } from '@google/genai';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  User,
  FileCheck,
  Key,
  X
} from 'lucide-react';

export function cleanAssistantText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // 1. Remove clusters of 3 or more asterisks (***, ****, etc.)
    .replace(/\*{3,}/g, '')
    // 2. Remove empty markdown bold/italic tags
    .replace(/\*\*\s*\*\*/g, '')
    // 3. Remove leading markdown heading hashes
    .replace(/^#{1,6}\s+/gm, '')
    // 4. Convert * bullets to •
    .replace(/^\s*[\*]\s+/gm, '• ')
    // 5. Clean up stray asterisks adjacent to colons
    .replace(/\*\*\s*:/g, ':')
    .replace(/:\s*\*\*/g, ': ')
    // 6. Filter out academic rubric terms: 'đề tài/dự án', 'tuần 3', 'I03'
    .replace(/\b(đề tài|dự án)\s+I03\b/gi, 'hệ thống chuẩn hóa')
    .replace(/\b(đề tài|dự án)\b/gi, 'hệ thống')
    .replace(/\b(tuần 3)\b/gi, '')
    // 7. Normalize multiple consecutive line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function renderFormattedContent(text: string) {
  const lines = text.split('\n');
  return lines.map((line, lIdx) => {
    // If empty line, give a small spacer
    if (line.trim() === '') {
      return <div key={lIdx} className="h-2" />;
    }

    // Split line by bold tags **...**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <div key={lIdx} className="leading-relaxed">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-stone-950">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

const stopWords = new Set([
  'di', 'san', 'vung', 'mien', 'van', 'hoa', 'la', 'gi', 'o', 'dau',
  'nhu', 'the', 'nao', 'cho', 'biet', 'hay', 've', 'thong', 'tin',
  'nguoi', 'cua', 'va', 'trong', 'cac', 'nhung', 'co', 'duoc',
  'thuc', 'hanh', 'nghe', 'thuat', 'tap', 'quan', 'le', 'hoi',
  'dieu', 'lang', 'buon', 'ban', 'tinh', 'huyen', 'xa',
]);

/**
 * Robust grounded matcher for offline / graceful fallback
 */
export function findRecordFromQuery(query: string, records: HeritageRecord[]): {
  matchedRecord: HeritageRecord | null;
  answer: string;
  isOutOfScope: boolean;
} {
  const qLower = query.toLowerCase().trim();

  // Region specific query: e.g. "Tây Nguyên"
  if (qLower.includes('tây nguyên')) {
    const tnRecords = records.filter(r => r.di_san_lien_quan.toLowerCase().includes('tây nguyên'));
    if (tnRecords.length > 0) {
      const listAnswers = tnRecords.map((r, i) => `${i + 1}. **${r.ten_tu_lieu}**
• Tên di sản: ${r.ten_tu_lieu}
• Vùng văn hóa: Tây Nguyên
• Cộng đồng / Nghệ nhân: ${r.nguoi_cung_cap_va_cong_dong}
• Nguồn tư liệu: ${r.nguon_goc_tu_lieu}
• Địa danh hiện nay: ${r.dia_danh_hien_nay}
• Nội dung: ${r.noi_dung_mo_ta_ngan}`).join('\n\n');

      return {
        matchedRecord: tnRecords[0],
        answer: `Trong kho dữ liệu di sản phi vật thể, vùng văn hóa Tây Nguyên gồm các di sản sau:\n\n${listAnswers}`,
        isOutOfScope: false,
      };
    }
  }

  // Exact heritage keyword matches
  const matched = records.filter((r) => {
    const tenLower = r.ten_tu_lieu.toLowerCase();
    if (qLower.includes(tenLower)) return true;

    if (qLower.includes('xòe') && (qLower.includes('thái') || qLower.includes('mường lò'))) return r.id === 'DS-TB-01';
    if (qLower.includes('sáp ong') || qLower.includes('mông hoa') || qLower.includes('tờ dâu')) return r.id === 'DS-TB-02';
    if (qLower.includes('then') && (qLower.includes('tày') || qLower.includes('nùng') || qLower.includes('tính tẩu'))) return r.id === 'DS-VB-01';
    if (qLower.includes('lồng tồng') || qLower.includes('xuống đồng') || qLower.includes('ba bể')) return r.id === 'DS-VB-02';
    if (qLower.includes('quan họ') || qLower.includes('làng diềm') || qLower.includes('la hời')) return r.id === 'DS-BB-01';
    if (qLower.includes('xoan') || qLower.includes('lãi lèn') || qLower.includes('quả cách')) return r.id === 'DS-BB-02';
    if (qLower.includes('đông hồ') || qLower.includes('giấy điệp') || qLower.includes('tranh khắc gỗ')) return r.id === 'DS-BB-03';
    if ((qLower.includes('ví') && qLower.includes('giặm')) || qLower.includes('nghệ tĩnh') || qLower.includes('phường vải')) return r.id === 'DS-BT-01';
    if (qLower.includes('cảnh dương') || qLower.includes('chèo cạn') || (qLower.includes('cầu ngư') && qLower.includes('quảng bình'))) return r.id === 'DS-BT-02';
    if (qLower.includes('bài chòi') || qLower.includes('anh hiệu') || qLower.includes('hô thai')) return r.id === 'DS-DH-01';
    if (qLower.includes('bàu trúc') || qLower.includes('gốm chăm') || qLower.includes('hamu trok')) return r.id === 'DS-DH-02';
    if (qLower.includes('bả trạo') || qLower.includes('thu bồn')) return r.id === 'DS-DH-03';
    if (qLower.includes('cồng chiêng') || qLower.includes('ching aráp') || qLower.includes('rơngao')) return r.id === 'DS-TN-01';
    if (qLower.includes('sử thi') || qLower.includes('klei khan') || qLower.includes('đăm sán') || qLower.includes('ó klei')) return r.id === 'DS-TN-02';
    if (qLower.includes('đờn ca tài tử') && (qLower.includes('bình dương') || qLower.includes('bản tổ'))) return r.id === 'DS-DN-01';
    if (qLower.includes('nghinh ông') || qLower.includes('cần giờ') || qLower.includes('thủy tướng')) return r.id === 'DS-DN-02';
    if (qLower.includes('dạ cổ hoài lang') || qLower.includes('cao văn lầu') || (qLower.includes('đờn ca tài tử') && qLower.includes('bạc liêu'))) return r.id === 'DS-TN-BO-01';
    if (qLower.includes('ok om bok') || qLower.includes('đua ghe ngo') || qLower.includes('tuk ngo') || (qLower.includes('khmer') && qLower.includes('sóc trăng'))) return r.id === 'DS-TN-BO-02';
    if (qLower.includes('mỹ lồng') || qLower.includes('bánh tráng')) return r.id === 'DS-TN-BO-03';

    // Meaningful word match (>= 2 distinct non-stop words)
    const words = tenLower.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    return words.filter(w => qLower.includes(w)).length >= 2;
  });

  if (matched.length === 0) {
    return {
      matchedRecord: null,
      answer: 'Chưa có tư liệu về nội dung này',
      isOutOfScope: true,
    };
  }

  const primary = matched[0];
  const regionName = primary.di_san_lien_quan.split('-')[1]?.trim() || 'Việt Nam';

  let responseText = `Thông tin xác thực từ cơ sở dữ liệu di sản:

• Tên di sản: ${primary.ten_tu_lieu}
• Vùng văn hóa: ${regionName}
• Cộng đồng / Nghệ nhân: ${primary.nguoi_cung_cap_va_cong_dong}
• Nguồn tư liệu: ${primary.nguon_goc_tu_lieu}

**Mô tả thực hành di sản:**
${primary.noi_dung_mo_ta_ngan}

• Địa danh hiện nay (3 cấp hành chính): ${primary.dia_danh_hien_nay}
• Địa danh thời điểm tư liệu: ${primary.dia_danh_thoi_diem_tu_lieu || 'Trùng khớp địa danh hiện nay'}`;

  if (primary.chu_giai_tu_ngu_ban_dia) {
    responseText += `\n• Chú giải từ ngữ bản địa: ${primary.chu_giai_tu_ngu_ban_dia}`;
  }

  return {
    matchedRecord: primary,
    answer: responseText,
    isOutOfScope: false,
  };
}

interface AiAssistantScreenProps {
  records: HeritageRecord[];
  onOpenRecord: (record: HeritageRecord) => void;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({
  records,
  onOpenRecord,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin kính chào! Tôi là Trợ lý AI tra cứu Di sản văn hóa phi vật thể Việt Nam.

Tôi được thiết lập để trả lời CHÍNH XÁC dựa trên tập dữ liệu chuẩn hóa 12 trường trong "disan.json". Mọi câu trả lời của tôi đều bắt buộc dẫn xuất 4 thông tin:
• Tên di sản
• Vùng văn hóa
• Cộng đồng / Nghệ nhân chủ thể
• Nguồn tư liệu xác thực

Theo nguyên tắc chống bịa đặt (Anti-Hallucination), nếu câu hỏi của bạn nằm ngoài tập dữ liệu này, tôi sẽ phản hồi nguyên văn: "Chưa có tư liệu về nội dung này".`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => {
    return (typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') : '') || '';
  });

  // Get active API key
  const getActiveApiKey = (): string => {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim() !== '' && envKey !== 'MY_GEMINI_API_KEY') {
      return envKey.trim();
    }
    if (customApiKey && customApiKey.trim()) {
      return customApiKey.trim();
    }
    return '';
  };

  const handleSaveCustomKey = (key: string) => {
    const trimmed = key.trim();
    setCustomApiKey(trimmed);
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('user_gemini_api_key', trimmed);
      } else {
        localStorage.removeItem('user_gemini_api_key');
      }
    }
    setShowKeyModal(false);
  };

  const activeKey = getActiveApiKey();

  const sampleQuestions = [
    {
      category: 'Hỏi đáp di sản chuẩn (Trong hệ thống)',
      query: 'Thực hành hát Then của người Tày, Nùng thuộc vùng văn hóa nào và do ai cung cấp?',
    },
    {
      category: 'Hỏi đáp di sản chuẩn (Trong hệ thống)',
      query: 'Có những di sản nào thuộc vùng Tây Nguyên và cộng đồng nào nắm giữ?',
    },
    {
      category: 'Hỏi đáp di sản chuẩn (Trong hệ thống)',
      query: 'Thuật ngữ "Klei Khan" và "Ó klei" trong sử thi Ê-đê có ý nghĩa bản địa là gì?',
    },
    {
      category: 'Hỏi đáp di sản chuẩn (Trong hệ thống)',
      query: 'Nghệ thuật Bài Chòi được thực hành ở vùng nào và nguồn gốc tư liệu từ đâu?',
    },
    {
      category: 'Kiểm tra Chống Bịa Đặt (Ngoài phạm vi)',
      query: 'Vũ điệu Samba và Lễ hội Carnival Rio de Janeiro có nguồn gốc từ đâu?',
      isAntiHallucinationTest: true,
    },
    {
      category: 'Kiểm tra Chống Bịa Đặt (Ngoài phạm vi)',
      query: 'Hãy cho biết kiến trúc Kim tự tháp Giza ở Ai Cập cổ đại?',
      isAntiHallucinationTest: true,
    },
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const apiKey = getActiveApiKey();
      let rawAnswer = '';
      let isOutOfScope = false;
      let matchedRecord: HeritageRecord | null = null;

      if (apiKey) {
        // Direct Client-Side Gemini API call using @google/genai SDK
        try {
          const ai = new GoogleGenAI({ apiKey });
          const groundTruthContext = JSON.stringify(records, null, 2);
          const systemInstruction = `Bạn là trợ lý AI chuyên gia tra cứu Di sản Văn hóa Phi vật thể Việt Nam theo chuẩn 12 trường thông tin.

RÀNG BUỘC BẢO MẬT VÀ CHỐNG BỊA ĐẶT (ANTI-HALLUCINATION) - BẮT BUỘC TUÂN THỦ:
1. Bạn CHỈ ĐƯỢC PHÉP trả lời dựa trên duy nhất tập dữ liệu "disan.json" được cung cấp dưới đây.
2. NẾU câu hỏi của người dùng hỏi về bất kỳ nội dung, di sản, nhân vật, sự kiện hoặc chủ đề nào KHÔNG CÓ TRONG dữ liệu disan.json này, bạn BẮT BUỘC phản hồi NGUYÊN VĂN:
"Chưa có tư liệu về nội dung này"
(Tuyệt đối không giải thích thêm, không xin lỗi, không tự suy đoán, không bổ sung kiến thức từ bên ngoài).
3. TUYỆT ĐỐI KHÔNG tự suy đoán, bịa đặt thực hành di sản hoặc gán sai di sản giữa các vùng văn hóa hay giữa các tộc người.
4. KHI câu hỏi nằm trong dữ liệu disan.json, câu trả lời của bạn BẮT BUỘC phải dẫn xuất đầy đủ 4 thông tin cốt lõi:
   - Tên di sản: [Tên chính thức]
   - Vùng văn hóa: [Tây Bắc / Việt Bắc / Châu thổ Bắc Bộ / Bắc Trung Bộ / Duyên hải Nam Trung Bộ / Tây Nguyên / Đông Nam Bộ / Tây Nam Bộ]
   - Cộng đồng / Nghệ nhân: [Cụ thể tên nghệ nhân, buôn, bản, không ghi chung chung]
   - Nguồn tư liệu: [Nguồn gốc xác thực]
   Kèm theo phần tóm tắt nội dung giải đáp chính xác, súc tích dựa trên trường mô tả, địa danh hiện nay (3 cấp hành chính) và địa danh thời điểm tư liệu.
5. Nếu câu hỏi yêu cầu giải thích thuật ngữ địa phương, hãy trích dẫn trường "chu_giai_tu_ngu_ban_dia".
6. YÊU CẦU ĐỊNH DẠNG: Phản hồi bằng văn bản tiếng Việt sạch sẽ, trình bày mạch lạc. KHÔNG sử dụng các ký tự định dạng trang trí dư thừa như *** hoặc **** làm rối mắt. KHÔNG dùng các từ "đề tài", "dự án", "tuần 3" hay "mã I03".

TẬP DỮ LIỆU DI SẢN CHUẨN XÁC:
${groundTruthContext}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: textToSend,
            config: {
              systemInstruction,
            },
          });

          rawAnswer = response.text || 'Chưa có tư liệu về nội dung này';
        } catch (geminiErr: any) {
          console.warn('Lỗi gọi Gemini API phía Client, chuyển đổi sang cơ chế tìm kiếm dữ liệu chuẩn hóa nội bộ:', geminiErr);
          const fallbackMatch = findRecordFromQuery(textToSend, records);
          rawAnswer = fallbackMatch.answer;
          isOutOfScope = fallbackMatch.isOutOfScope;
          matchedRecord = fallbackMatch.matchedRecord;
        }
      } else {
        // When no API key is provided, perform grounded match directly on the 18 standardized records
        const localMatch = findRecordFromQuery(textToSend, records);
        rawAnswer = localMatch.answer;
        isOutOfScope = localMatch.isOutOfScope;
        matchedRecord = localMatch.matchedRecord;
      }

      // Clean string from any redundant asterisks or rubric terms
      const cleanedAnswer = cleanAssistantText(rawAnswer);
      if (cleanedAnswer.trim() === 'Chưa có tư liệu về nội dung này') {
        isOutOfScope = true;
      }

      // Identify matched record for interactive citation view
      if (!matchedRecord && !isOutOfScope) {
        matchedRecord = records.find(
          (r) =>
            textToSend.toLowerCase().includes(r.ten_tu_lieu.toLowerCase().slice(0, 8)) ||
            cleanedAnswer.toLowerCase().includes(r.ten_tu_lieu.toLowerCase().slice(0, 8))
        ) || null;
      }

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: cleanedAnswer,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isOutOfScope,
        heritageMetadata: matchedRecord
          ? {
              ten_di_san: matchedRecord.ten_tu_lieu,
              vung_van_hoa: matchedRecord.di_san_lien_quan.split('-')[1]?.trim() || '',
              cong_dong: matchedRecord.nguoi_cung_cap_va_cong_dong,
              nguon_tu_lieu: matchedRecord.nguon_goc_tu_lieu,
              recordId: matchedRecord.id,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Fatal assistant error:', err);
      const errorMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Chưa có tư liệu về nội dung này',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isOutOfScope: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Cuộc trò chuyện đã được làm mới. Bạn có thể tra cứu di sản theo chuẩn 12 trường hoặc thử nghiệm cơ chế chống bịa đặt (Anti-Hallucination).',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Anti-Hallucination Guidelines Box */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              <Bot className="w-4 h-4 text-amber-700" />
              TRỢ LÝ TRA CỨU AI GEMINI CLIENT-SIDE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-900 tracking-tight">
              Hỏi đáp Di sản Văn hóa Phi vật thể 8 Vùng miền
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            {activeKey ? (
              <button
                onClick={() => setShowKeyModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                title="Bấm để cấu hình lại API Key"
              >
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span>API Key: Đã kết nối</span>
              </button>
            ) : (
              <button
                onClick={() => setShowKeyModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
                title="Bấm để nhập Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-700" />
                <span>Cài đặt VITE_GEMINI_API_KEY</span>
              </button>
            )}

            <button
              onClick={handleResetChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Security & Anti-Hallucination Notice */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-xs text-amber-950 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900">100% Căn cứ vào disan.json</strong>
              Không suy đoán, không bổ sung thông tin ngoài tập dữ liệu 18 di sản đã kiểm chứng.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900">Phản hồi Anti-Hallucination</strong>
              Nếu hỏi ngoài dữ liệu: Bắt buộc trả lời nguyên văn <em>"Chưa có tư liệu về nội dung này"</em>.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900">4 Dẫn xuất Bắt buộc</strong>
              Tên di sản • Vùng văn hóa • Cộng đồng/Nghệ nhân • Nguồn tư liệu chính thống.
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
          Câu hỏi mẫu gợi ý (Bấm để gửi ngay):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.query)}
              className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                q.isAntiHallucinationTest
                  ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 text-amber-950'
                  : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {q.isAntiHallucinationTest ? (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                    TEST CHỐNG BỊA ĐẶT
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                    CHUẨN 12 TRƯỜNG
                  </span>
                )}
              </div>
              <span className="font-medium line-clamp-2">{q.query}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden flex flex-col min-h-[500px]">
        {/* Messages Stream */}
        <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto max-h-[600px] bg-stone-50/30">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-amber-900 text-white'
                      : 'bg-stone-900 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-amber-900 text-white rounded-tr-none whitespace-pre-wrap'
                        : msg.isOutOfScope
                        ? 'bg-amber-50 border-2 border-amber-400 text-amber-950 rounded-tl-none font-medium whitespace-pre-wrap'
                        : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none shadow-2xs space-y-1'
                    }`}
                  >
                    {isUser ? msg.text : renderFormattedContent(msg.text)}
                  </div>

                  {/* Out of scope Anti-Hallucination notice badge */}
                  {msg.isOutOfScope && (
                    <div className="bg-amber-100 border border-amber-300 text-amber-950 p-2.5 rounded-xl text-xs flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>Xác thực Anti-Hallucination:</strong> Câu hỏi nằm ngoài phạm vi 18 bản ghi di sản của <code>disan.json</code>. Hệ thống từ chối suy đoán để bảo vệ tính toàn vẹn dữ liệu.
                      </span>
                    </div>
                  )}

                  {/* Citation Card if metadata present */}
                  {msg.heritageMetadata && msg.heritageMetadata.recordId && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Dẫn xuất đối sánh từ disan.json:
                        </span>
                        {(() => {
                          const matched = records.find((r) => r.id === msg.heritageMetadata?.recordId);
                          return (
                            matched && (
                              <button
                                onClick={() => onOpenRecord(matched)}
                                className="text-emerald-800 hover:text-emerald-950 font-semibold underline flex items-center gap-1 text-[11px]"
                              >
                                Xem hồ sơ 12 trường
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )
                          );
                        })()}
                      </div>
                      <div className="text-[11px] text-emerald-900/90 font-mono space-y-0.5">
                        <div>• <strong>Tên di sản:</strong> {msg.heritageMetadata.ten_di_san}</div>
                        <div>• <strong>Vùng văn hóa:</strong> {msg.heritageMetadata.vung_van_hoa}</div>
                        <div>• <strong>Cộng đồng:</strong> {msg.heritageMetadata.cong_dong}</div>
                        <div>• <strong>Nguồn:</strong> {msg.heritageMetadata.nguon_tu_lieu}</div>
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] text-stone-400 px-1 ${isUser ? 'text-right' : ''}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-stone-500">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl px-4 py-2.5 shadow-2xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Đang kết nối Gemini API và kiểm định trên disan.json...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Đặt câu hỏi về di sản, nghệ nhân, vùng văn hóa hoặc thuật ngữ bản địa..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>Gửi câu hỏi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center text-[11px] text-stone-400">
            Trợ lý AI Gemini trực tiếp từ Client • Giám sát chống bịa đặt (Anti-Hallucination) dựa trên kho dữ liệu di sản phi vật thể.
          </div>
        </div>
      </div>

      {/* Modal Cài đặt API Key khi deploy Vercel */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Key className="w-4 h-4 text-amber-700" />
                Cấu hình Gemini API Key (Vercel Client)
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Khi deploy lên <strong>Vercel</strong>, bạn có thể thiết lập biến môi trường <code>VITE_GEMINI_API_KEY</code> trong Project Settings. Hoặc dán trực tiếp API Key vào ô dưới đây (được lưu an toàn trong trình duyệt của bạn).
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gemini API Key:
              </label>
              <input
                type="password"
                defaultValue={customApiKey}
                id="custom-key-input"
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 font-mono"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-normal">
              <strong>Lưu ý:</strong> Nếu không nhập API Key, hệ thống vẫn hoạt động thông minh và tự động trả lời chính xác dựa trên kho dữ liệu chuẩn hóa 18 di sản đã kiểm chứng!
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('custom-key-input') as HTMLInputElement;
                  handleSaveCustomKey(input ? input.value : '');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-xl transition-colors shadow-xs"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
