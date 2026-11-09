import React, { useState } from 'react';
import { HeritageRecord, ChatMessage } from '../types/heritage';
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
  FileCheck
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
    // 6. Normalize multiple consecutive line breaks
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
      const response = await fetch('/api/gemini/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Lỗi kết nối máy chủ AI');
      }

      const data = await response.json();
      const rawAnswer = data.answer || 'Chưa có tư liệu về nội dung này';
      
      // Clean string from any redundant asterisks before saving into state
      const cleanedAnswer = cleanAssistantText(rawAnswer);
      const isOutOfScope = data.isOutOfScope || cleanedAnswer.trim() === 'Chưa có tư liệu về nội dung này';

      // Check matched record
      let matchedRecord = null;
      if (data.matchedRecord && data.matchedRecord.id) {
        matchedRecord = records.find((r) => r.id === data.matchedRecord.id);
      }
      if (!matchedRecord && !isOutOfScope) {
        // Fallback search in local records
        matchedRecord = records.find(
          (r) =>
            textToSend.toLowerCase().includes(r.ten_tu_lieu.toLowerCase().slice(0, 8)) ||
            cleanedAnswer.toLowerCase().includes(r.ten_tu_lieu.toLowerCase().slice(0, 8))
        );
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
      console.error(err);
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
              TRỢ LÝ TRA CỨU AI GEMINI
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-900 tracking-tight">
              Hỏi đáp Di sản Văn hóa Phi vật thể 8 Vùng miền
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Hệ thống trả lời thông minh dựa trên tập dữ liệu chuẩn hóa <strong>disan.json</strong>. Bắt buộc dẫn xuất đủ 4 yếu tố: Tên di sản + Vùng văn hóa + Cộng đồng/Nghệ nhân + Nguồn tư liệu xác thực.
            </p>
          </div>

          <button
            onClick={handleResetChat}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors shrink-0 self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm mới hội thoại
          </button>
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
                <span>Đang tra cứu và kiểm định thông tin trên disan.json...</span>
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
            Trợ lý tra cứu AI bảo mật server-side • Giám sát chống bịa đặt (Anti-Hallucination) dựa trên kho dữ liệu di sản phi vật thể.
          </div>
        </div>
      </div>
    </div>
  );
};
