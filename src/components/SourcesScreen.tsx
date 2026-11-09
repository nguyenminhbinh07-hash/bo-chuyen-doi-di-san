import React from 'react';
import { HERITAGE_SOURCES } from '../data/sources';
import {
  Layers,
  ExternalLink,
  ShieldCheck,
  Building,
  Music,
  Globe,
  BookOpen,
  Users,
  Landmark,
  Library,
  MapPin,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export const SourcesScreen: React.FC = () => {
  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building':
        return <Building className="w-5 h-5 text-amber-600" />;
      case 'Music':
        return <Music className="w-5 h-5 text-indigo-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-sky-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-rose-600" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-700" />;
      case 'Library':
        return <Library className="w-5 h-5 text-violet-600" />;
      default:
        return <MapPin className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Introduction Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Layers className="w-4 h-4 text-amber-700" />
            HỆ THỐNG NGUỒN TƯ LIỆU CHÍNH THỐNG
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-900 tracking-tight">
            Quản lý Nguồn tư liệu Di sản được công nhận
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Danh mục 8 cơ quan, viện nghiên cứu và tổ chức quốc tế có thẩm quyền thẩm định, cấp phép và lưu trữ tư liệu khoa học về di sản văn hóa phi vật thể của Việt Nam theo Luật Di sản văn hóa 2024.
          </p>
        </div>
      </div>

      {/* Grid of Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HERITAGE_SOURCES.map((source) => (
          <div
            key={source.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header with Icon and Code */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getSourceIcon(source.bieu_tuong)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {source.id}
                    </span>
                    <h3 className="font-bold font-heritage text-base sm:text-lg text-stone-900 mt-1 leading-snug">
                      {source.ten_to_chuc}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Governing body */}
              <div className="text-xs text-stone-500 font-medium">
                Cơ quan chủ quản: <span className="text-stone-800 font-semibold">{source.co_quan_chu_quan}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {source.mo_ta}
              </p>

              {/* Details table */}
              <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                  <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Vai trò thẩm định khoa học:
                  </div>
                  <div className="text-stone-600 text-[11px] leading-relaxed">
                    {source.vai_tro_tham_dinh}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-stone-50/70 p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Quy mô lưu trữ:</span>
                    <span className="font-semibold text-stone-800">{source.so_luong_ho_so_tham_chieu}</span>
                  </div>
                  <div className="bg-stone-50/70 p-2 rounded-lg border border-stone-100">
                    <span className="text-stone-400 block text-[10px]">Trọng tâm nghiên cứu:</span>
                    <span className="font-semibold text-stone-800 truncate block">{source.linh_vuc_chinh}</span>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500">
                  <strong className="text-stone-700">Quy chuẩn trích dẫn:</strong>{' '}
                  <code className="text-amber-900 bg-amber-50/80 px-1.5 py-0.5 rounded font-mono text-[10px]">
                    {source.tieu_chuan_trich_dan}
                  </code>
                </div>
              </div>
            </div>

            {/* Visit Portal Button */}
            <div className="pt-3 border-t border-stone-100">
              <a
                href={source.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                <span>Truy cập Cổng thông tin lưu trữ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines Box: 4-Step Verification Workflow */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-900/40 shadow-lg">
        <h3 className="text-lg font-bold font-heritage text-amber-200 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          Quy trình 4 Bước Xác thực Nguồn tư liệu Di sản
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-300">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Điền dã & Ghi âm/hình</h4>
            <p className="text-[11px] text-stone-400">
              Thu thập thực địa có ghi rõ tọa độ địa danh 2 cấp hành chính (hiện nay và tên cổ thời điểm tư liệu).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Xác lập Đồng thuận FPIC</h4>
            <p className="text-[11px] text-stone-400">
              Ký kết biên bản đồng thuận tự nguyện với nghệ nhân, buôn bản hoặc làng nghề (ghi nhận <code>is_consented</code>).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Đối chiếu Viện & Cục</h4>
            <p className="text-[11px] text-stone-400">
              Gắn mã định danh hồ sơ khoa học từ Cục Di sản văn hóa hoặc các Viện chuyên ngành thẩm định.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1.5">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="font-bold text-white text-sm">Chuẩn hóa 12 trường</h4>
            <p className="text-[11px] text-stone-400">
              Đồng bộ vào tệp <code>disan.json</code>, loại bỏ hoàn toàn nguy cơ bịa đặt thông tin khi phục vụ cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
