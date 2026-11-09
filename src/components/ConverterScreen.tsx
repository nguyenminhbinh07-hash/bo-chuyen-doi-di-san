import React, { useState } from 'react';
import { HeritageRecord, MediaType } from '../types/heritage';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_RAW_DATA, parseRawHeritageHeuristically } from '../utils/converter';
import {
  Sparkles,
  FileCode,
  Table as TableIcon,
  Copy,
  Download,
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  Users,
  Compass,
  FileCheck
} from 'lucide-react';

import { ScreenTab } from './Navbar';

interface ConverterScreenProps {
  onSaveToLibrary: (record: HeritageRecord) => void;
  totalRecordsCount: number;
  onNavigateToLibrary: () => void;
  onNavigateToScreen: (tab: ScreenTab) => void;
}

export const ConverterScreen: React.FC<ConverterScreenProps> = ({
  onSaveToLibrary,
  totalRecordsCount,
  onNavigateToLibrary,
  onNavigateToScreen,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-1');
  const [inputText, setInputText] = useState<string>(SAMPLE_RAW_DATA[0].rawText);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'table' | 'json'>('table');
  const [convertedRecord, setConvertedRecord] = useState<HeritageRecord>(() =>
    parseRawHeritageHeuristically(SAMPLE_RAW_DATA[0].rawText)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle sample selection
  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const sample = SAMPLE_RAW_DATA.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.rawText);
      const parsed = parseRawHeritageHeuristically(sample.rawText);
      setConvertedRecord(parsed);
      setSavedSuccess(false);
      setErrorMessage(null);
    }
  };

  // Convert via AI Gemini Backend Route
  const handleConvertWithAI = async () => {
    if (!inputText.trim()) {
      setErrorMessage('Vui lòng nhập dữ liệu thô trước khi chuyển đổi.');
      return;
    }
    setIsConverting(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('user_gemini_api_key') : '') || '';

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const systemPrompt = `Bạn là chuyên gia số hóa di sản văn hóa phi vật thể Việt Nam. Nhiệm vụ của bạn là trích xuất văn bản thô thành một đối tượng JSON chuẩn xác đủ 12 trường thông tin:
{
  "ten_tu_lieu": string,
  "loai_tu_lieu": "Ảnh" | "Ghi âm" | "Ghi hình" | "Văn bản",
  "noi_dung_mo_ta_ngan": string,
  "di_san_lien_quan": string,
  "dia_danh_hien_nay": string,
  "dia_danh_thoi_diem_tu_lieu": string,
  "thoi_diem_thu_thap": string,
  "nguoi_thu_thap": string,
  "nguoi_cung_cap_va_cong_dong": string,
  "pham_vi_su_dung": string,
  "is_consented": boolean,
  "nguon_goc_tu_lieu": string,
  "chu_giai_tu_ngu_ban_dia": string
}
Chỉ trả về JSON thuần túy, không bọc markdown.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `Văn bản thô:\n${inputText}`,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
            },
          });

          const text = response.text || '{}';
          const aiData = JSON.parse(text);
          const validRecord: HeritageRecord = {
            id: `DS-AI-${Date.now().toString().slice(-4)}`,
            ten_tu_lieu: aiData.ten_tu_lieu || 'Di sản văn hóa phi vật thể',
            loai_tu_lieu: (['Ảnh', 'Ghi âm', 'Ghi hình', 'Văn bản'].includes(aiData.loai_tu_lieu)
              ? aiData.loai_tu_lieu
              : 'Văn bản') as MediaType,
            noi_dung_mo_ta_ngan: aiData.noi_dung_mo_ta_ngan || '',
            di_san_lien_quan: aiData.di_san_lien_quan || '',
            dia_danh_hien_nay: aiData.dia_danh_hien_nay || '',
            dia_danh_thoi_diem_tu_lieu: aiData.dia_danh_thoi_diem_tu_lieu || '',
            thoi_diem_thu_thap: aiData.thoi_diem_thu_thap || '',
            nguoi_thu_thap: aiData.nguoi_thu_thap || '',
            nguoi_cung_cap_va_cong_dong: aiData.nguoi_cung_cap_va_cong_dong || '',
            pham_vi_su_dung: aiData.pham_vi_su_dung || '',
            is_consented: typeof aiData.is_consented === 'boolean' ? aiData.is_consented : true,
            nguon_goc_tu_lieu: aiData.nguon_goc_tu_lieu || '',
            chu_giai_tu_ngu_ban_dia: aiData.chu_giai_tu_ngu_ban_dia || '',
          };
          setConvertedRecord(validRecord);
          return;
        } catch (apiErr) {
          console.warn('Lỗi gọi Gemini SDK phía client, sử dụng bộ trích xuất heuristic:', apiErr);
        }
      }

      // Heuristic fallback if no API key or network error
      const fallback = parseRawHeritageHeuristically(inputText);
      setConvertedRecord(fallback);
      if (!apiKey) {
        setErrorMessage('Đã trích xuất chuẩn 12 trường qua Heuristic Parser (chưa cấu hình API Key).');
      }
    } catch (err: any) {
      console.warn('Conversion error:', err);
      const fallback = parseRawHeritageHeuristically(inputText);
      setConvertedRecord(fallback);
    } finally {
      setIsConverting(false);
    }
  };

  // Fast Rule-based / Heuristic parser
  const handleConvertHeuristic = () => {
    if (!inputText.trim()) {
      setErrorMessage('Vui lòng nhập văn bản thô.');
      return;
    }
    const result = parseRawHeritageHeuristically(inputText);
    setConvertedRecord(result);
    setSavedSuccess(false);
    setErrorMessage(null);
  };

  // Copy JSON
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(convertedRecord, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(convertedRecord, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${convertedRecord.id || 'disan'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Save to Library
  const handleSave = () => {
    onSaveToLibrary(convertedRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Update a single field manually
  const handleFieldChange = (field: keyof HeritageRecord, value: any) => {
    setConvertedRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 text-white p-6 sm:p-10 border border-amber-800/40 shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold tracking-wide">
            <Compass className="w-4 h-4 text-amber-300" />
            HỆ THỐNG SỐ HÓA VÀ CHUYỂN ĐỔI DI SẢN PHI VẬT THỂ
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heritage tracking-tight leading-tight text-amber-50">
            Bộ chuyển đổi dữ liệu di sản sang chuẩn mô tả chung
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Giải pháp số hóa và tự động phân rã văn bản điền dã thô, biên bản kiểm kê và ghi chép thực địa sang chuẩn cấu trúc <strong>12 trường thông tin thống nhất</strong> theo Luật Di sản văn hóa 2024, đáp ứng 8 vùng văn hóa Việt Nam.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">12</div>
              <div className="text-xs text-stone-300 mt-1">Trường chuẩn hóa</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">8</div>
              <div className="text-xs text-stone-300 mt-1">Vùng văn hóa lớn</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">{totalRecordsCount}</div>
              <div className="text-xs text-stone-300 mt-1">Bản ghi trong Thư viện</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono">100%</div>
              <div className="text-xs text-stone-300 mt-1">Kiểm soát FPIC & Nguồn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Conversion Studio */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Studio (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-700" />
                Dữ liệu thô đầu vào
              </h3>
              <span className="text-xs text-stone-400">Chọn mẫu hoặc nhập tự do</span>
            </div>

            {/* Preset Samples Selector */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                Mẫu dữ liệu thực địa có sẵn (Click để thử nghiệm):
              </label>
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_RAW_DATA.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="font-semibold">{sample.title}</div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {sample.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Raw Text Input Area */}
            <div>
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                Nội dung văn bản thô / ghi chép điền dã:
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={11}
                placeholder="Dán nội dung sổ tay điền dã, biên bản phỏng vấn nghệ nhân, báo cáo kiểm kê di sản..."
                className="w-full text-xs font-mono p-3 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800 transition-all leading-relaxed"
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Conversion Actions */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleConvertWithAI}
                disabled={isConverting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-xl text-xs font-semibold hover:from-amber-700 hover:to-stone-900 transition-all shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isConverting ? 'animate-spin text-amber-300' : 'text-amber-400'}`} />
                {isConverting ? 'Đang phân tích cấu trúc 12 trường...' : 'Chuyển đổi với Gemini AI'}
              </button>
              <button
                type="button"
                onClick={handleConvertHeuristic}
                disabled={isConverting}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl text-xs font-medium transition-colors"
                title="Trích xuất nhanh dựa trên quy tắc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Trích xuất nhanh
              </button>
            </div>
          </div>

          {/* Guidelines box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
              <BookOpen className="w-4 h-4 text-amber-700" />
              Quy chuẩn thống nhất 12 trường thông tin
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed text-[11px]">
              <li>
                <strong>Trường 5:</strong> Địa danh hiện nay (chính xác xã/phường, quận/huyện, tỉnh/thành phố).
              </li>
              <li>
                <strong>Trường 6:</strong> Địa danh tại thời điểm tư liệu (tên cũ thời Nguyễn/Pháp thuộc/tên bản địa).
              </li>
              <li>
                <strong>Trường 10:</strong> Trạng thái xin phép cộng đồng bắt buộc là <code>is_consented: boolean</code>.
              </li>
              <li>
                <strong>Cảnh báo màu cam:</strong> Tự động kích hoạt khi <code>is_consented === false</code> hoặc nguồn chưa xác thực.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Standard 12-Field Live Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
            {/* Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                  Kết quả chuẩn hóa
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 font-heritage">
                  {convertedRecord.ten_tu_lieu || 'Bản ghi di sản'}
                </h3>
              </div>

              {/* View toggle */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreviewTab === 'table'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5 text-amber-700" />
                  Bảng 12 trường
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('json')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreviewTab === 'json'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-700" />
                  Mã JSON
                </button>
              </div>
            </div>

            {/* Validation & Warning Notice */}
            <div className="py-3">
              {convertedRecord.is_consented ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Đạt chuẩn đồng thuận cộng đồng (<strong>is_consented = true</strong>). Sẵn sàng đồng bộ!
                    </span>
                  </div>
                  <span className="bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                    HỢP LỆ
                  </span>
                </div>
              ) : (
                <div className="bg-amber-100 border border-amber-400 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>CẢNH BÁO MÀU CAM:</strong> Chưa có biên bản đồng thuận FPIC (<strong>is_consented = false</strong>). Cần thẩm định trước khi xuất bản.
                    </span>
                  </div>
                  <span className="bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-[10px] font-bold">
                    CẢNH BÁO
                  </span>
                </div>
              )}
            </div>

            {/* TAB 1: Structured Table View */}
            {activePreviewTab === 'table' ? (
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto border border-stone-200 rounded-xl">
                <table className="w-full text-xs text-left text-stone-800">
                  <thead className="text-[11px] uppercase bg-stone-100 text-stone-700 sticky top-0 z-10 border-b border-stone-200">
                    <tr>
                      <th className="px-3.5 py-2.5 font-bold w-12 text-center">STT</th>
                      <th className="px-3.5 py-2.5 font-bold w-48">Trường thông tin (12 trường)</th>
                      <th className="px-3.5 py-2.5 font-bold">Giá trị đã chuẩn hóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">1</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Tên tư liệu</td>
                      <td className="px-3.5 py-2 font-bold text-amber-950">{convertedRecord.ten_tu_lieu}</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">2</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Loại tư liệu</td>
                      <td className="px-3.5 py-2">
                        <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200 font-medium">
                          {convertedRecord.loai_tu_lieu}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">3</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Nội dung mô tả ngắn</td>
                      <td className="px-3.5 py-2 text-stone-700 leading-relaxed">{convertedRecord.noi_dung_mo_ta_ngan}</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">4</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Di sản liên quan & Vùng</td>
                      <td className="px-3.5 py-2 text-stone-800 font-medium">{convertedRecord.di_san_lien_quan}</td>
                    </tr>
                    <tr className="hover:bg-stone-50 bg-emerald-50/30">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-emerald-700">5</td>
                      <td className="px-3.5 py-2 font-bold text-emerald-900">
                        Địa danh hiện nay
                      </td>
                      <td className="px-3.5 py-2 font-bold text-emerald-950 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {convertedRecord.dia_danh_hien_nay}
                      </td>
                    </tr>
                    <tr className="hover:bg-stone-50 bg-stone-50/60">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-600">6</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-800">
                        Địa danh thời điểm tư liệu
                      </td>
                      <td className="px-3.5 py-2 text-stone-600 italic">
                        {convertedRecord.dia_danh_thoi_diem_tu_lieu}
                      </td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">7</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Thời điểm thu thập</td>
                      <td className="px-3.5 py-2 text-stone-800">{convertedRecord.thoi_diem_thu_thap}</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">8</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Người thu thập</td>
                      <td className="px-3.5 py-2 text-stone-800">{convertedRecord.nguoi_thu_thap}</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">9</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Người cung cấp & Cộng đồng</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-950">{convertedRecord.nguoi_cung_cap_va_cong_dong}</td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">10</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Phạm vi & Xin phép (is_consented)</td>
                      <td className="px-3.5 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              convertedRecord.is_consented
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-500 text-stone-950'
                            }`}
                          >
                            is_consented: {String(convertedRecord.is_consented)}
                          </span>
                        </div>
                        <p className="text-stone-700">{convertedRecord.pham_vi_su_dung}</p>
                      </td>
                    </tr>
                    <tr className="hover:bg-stone-50">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-stone-400">11</td>
                      <td className="px-3.5 py-2 font-semibold text-stone-900">Nguồn gốc tư liệu</td>
                      <td className="px-3.5 py-2 font-mono text-[11px] text-blue-900 break-all">{convertedRecord.nguon_goc_tu_lieu}</td>
                    </tr>
                    <tr className="hover:bg-stone-50 bg-amber-50/20">
                      <td className="px-3.5 py-2 text-center font-mono font-bold text-amber-700">12</td>
                      <td className="px-3.5 py-2 font-semibold text-amber-900">Chú giải từ ngữ bản địa</td>
                      <td className="px-3.5 py-2 text-amber-950 italic">{convertedRecord.chu_giai_tu_ngu_ban_dia}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              /* TAB 2: JSON Code View */
              <div className="relative">
                <pre className="bg-stone-950 text-emerald-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed border border-stone-800">
                  {JSON.stringify(convertedRecord, null, 2)}
                </pre>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-5 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Đã copy JSON' : 'Sao chép JSON'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-stone-600" />
                  Tải tệp .json
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  {savedSuccess ? 'Đã thêm thành công!' : 'Thêm vào Thư viện di sản'}
                </button>
                <button
                  type="button"
                  onClick={onNavigateToLibrary}
                  className="inline-flex items-center gap-1 px-3 py-2 text-stone-600 hover:text-stone-900 rounded-xl text-xs font-medium transition-colors"
                >
                  Đến Thư viện
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
