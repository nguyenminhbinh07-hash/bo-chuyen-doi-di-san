import React from 'react';
import { HeritageRecord } from '../types/heritage';
import {
  X,
  MapPin,
  Calendar,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  FileText,
  Volume2,
  Video,
  Image as ImageIcon,
  Copy,
  Check,
  History,
  FileCheck,
  Share2
} from 'lucide-react';

interface ModalDetailProps {
  record: HeritageRecord | null;
  onClose: () => void;
}

export const ModalDetail: React.FC<ModalDetailProps> = ({ record, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'Ảnh':
        return <ImageIcon className="w-5 h-5 text-emerald-600" />;
      case 'Ghi âm':
        return <Volume2 className="w-5 h-5 text-indigo-600" />;
      case 'Ghi hình':
        return <Video className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white border border-stone-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-1 rounded-full font-mono font-medium">
                  Mã: {record.id}
                </span>
                <span className="bg-white/10 text-stone-200 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  {getMediaIcon(record.loai_tu_lieu)}
                  Loại: {record.loai_tu_lieu}
                </span>
                {record.is_consented ? (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Đã có đồng thuận FPIC
                  </span>
                ) : (
                  <span className="bg-amber-500 text-stone-950 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    CẢNH BÁO: CHƯA ĐỒNG THUẬN (is_consented: false)
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heritage tracking-tight leading-snug">
                {record.ten_tu_lieu}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - 12 Standard Fields Grid */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Warning Banner if is_consented is false */}
          {!record.is_consented && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Lưu ý về Bản quyền & Thẩm quyền sử dụng
                  </h4>
                  <p className="text-xs text-amber-800 mt-1">
                    Bản ghi này chưa nhận được văn bản đồng thuận chính thức từ cộng đồng chủ thể hoặc nghệ nhân nắm giữ di sản (FPIC). Chỉ được lưu trữ nội bộ phục vụ rà soát, cấm mọi hành vi xuất bản thương mại.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Short Description (Field 3) */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              [Trường 3] Nội dung mô tả ngắn
            </span>
            <p className="text-stone-800 leading-relaxed text-sm sm:text-base">
              {record.noi_dung_mo_ta_ngan}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 4: Related Heritage */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-4 h-4" />
                [Trường 4] Di sản liên quan & Vùng văn hóa
              </div>
              <p className="text-stone-900 text-sm font-medium">
                {record.di_san_lien_quan}
              </p>
            </div>

            {/* Field 5: Current Location */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                [Trường 5] Địa danh hiện nay (3 cấp hành chính)
              </div>
              <p className="text-stone-900 text-sm font-semibold text-emerald-950">
                {record.dia_danh_hien_nay}
              </p>
            </div>

            {/* Field 6: Former Location */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-700 text-xs font-bold uppercase tracking-wider mb-2">
                <History className="w-4 h-4" />
                [Trường 6] Địa danh tại thời điểm tư liệu (tên cũ)
              </div>
              <p className="text-stone-800 text-sm italic">
                {record.dia_danh_thoi_diem_tu_lieu || 'Trùng khớp với địa danh hiện nay'}
              </p>
            </div>

            {/* Field 7: Collection Time */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                [Trường 7] Thời điểm thu thập
              </div>
              <p className="text-stone-900 text-sm font-medium">
                {record.thoi_diem_thu_thap}
              </p>
            </div>

            {/* Field 8: Collector */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-stone-700 text-xs font-bold uppercase tracking-wider mb-2">
                <UserCheck className="w-4 h-4" />
                [Trường 8] Người thu thập
              </div>
              <p className="text-stone-900 text-sm">
                {record.nguoi_thu_thap}
              </p>
            </div>

            {/* Field 9: Artisan & Specific Community */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <FileCheck className="w-4 h-4" />
                [Trường 9] Người cung cấp & Cộng đồng di sản
              </div>
              <p className="text-stone-950 text-sm font-semibold">
                {record.nguoi_cung_cap_va_cong_dong}
              </p>
            </div>

            {/* Field 10: Scope of Use & Consent */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-stone-800 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  [Trường 10] Phạm vi được phép sử dụng & Trạng thái xin phép
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  record.is_consented
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-400'
                }`}>
                  is_consented: {String(record.is_consented)}
                </span>
              </div>
              <p className="text-stone-800 text-sm">
                {record.pham_vi_su_dung}
              </p>
            </div>

            {/* Field 11: Origin & Source */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs md:col-span-2">
              <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Share2 className="w-4 h-4" />
                [Trường 11] Nguồn gốc tư liệu chính thống
              </div>
              <p className="text-stone-800 text-sm font-mono bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 break-all">
                {record.nguon_goc_tu_lieu}
              </p>
            </div>

            {/* Field 12: Indigenous Terms */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 md:col-span-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-1">
                [Trường 12] Chú giải từ ngữ bản địa & thuật ngữ cổ truyền
              </span>
              <p className="text-amber-950 text-sm leading-relaxed font-serif-display italic">
                {record.chu_giai_tu_ngu_ban_dia || 'Không có thuật ngữ địa phương đặc biệt.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Chuẩn hóa 12 trường dữ liệu Di sản văn hóa phi vật thể (Luật DSVH 2024)
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã sao chép JSON' : 'Sao chép JSON'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors shadow-xs"
            >
              Đóng lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
