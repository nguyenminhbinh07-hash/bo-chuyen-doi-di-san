import React, { useState, useMemo } from 'react';
import { HeritageRecord, CulturalRegion, HeritageCategory, MediaType } from '../types/heritage';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  History,
  Download,
  Users,
  Eye,
  Volume2,
  Video,
  Image as ImageIcon,
  FileText,
  Compass,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LibraryScreenProps {
  records: HeritageRecord[];
  onSelectRecord: (record: HeritageRecord) => void;
}

const REGIONS: CulturalRegion[] = [
  'Tây Bắc',
  'Việt Bắc',
  'Châu thổ Bắc Bộ',
  'Bắc Trung Bộ',
  'Duyên hải Nam Trung Bộ',
  'Tây Nguyên',
  'Đông Nam Bộ',
  'Tây Nam Bộ',
];

const CATEGORIES: HeritageCategory[] = [
  'Tiếng nói, chữ viết',
  'Ngữ văn dân gian',
  'Nghệ thuật trình diễn dân gian',
  'Tập quán xã hội và tín ngưỡng',
  'Lễ hội truyền thống',
  'Nghề thủ công truyền thống',
  'Tri thức dân gian',
];

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  records,
  onSelectRecord,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('ALL');
  const [consentFilter, setConsentFilter] = useState<'ALL' | 'CONSENTED' | 'WARNING'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Count items with warnings (unconsented or unverified)
  const warningCount = useMemo(() => {
    return records.filter(
      (r) => !r.is_consented || (r.nguon_goc_tu_lieu && r.nguon_goc_tu_lieu.includes('Chưa có mã'))
    ).length;
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Region filter
      if (selectedRegion !== 'ALL') {
        if (!r.di_san_lien_quan.includes(selectedRegion)) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (!r.di_san_lien_quan.includes(selectedCategory)) {
          return false;
        }
      }

      // Media type
      if (selectedMediaType !== 'ALL') {
        if (r.loai_tu_lieu !== selectedMediaType) {
          return false;
        }
      }

      // Consent filter
      if (consentFilter === 'CONSENTED' && !r.is_consented) {
        return false;
      }
      if (consentFilter === 'WARNING' && r.is_consented) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = r.ten_tu_lieu.toLowerCase().includes(query);
        const matchLoc = r.dia_danh_hien_nay.toLowerCase().includes(query);
        const matchOldLoc = r.dia_danh_thoi_diem_tu_lieu.toLowerCase().includes(query);
        const matchCommunity = r.nguoi_cung_cap_va_cong_dong.toLowerCase().includes(query);
        const matchDesc = r.noi_dung_mo_ta_ngan.toLowerCase().includes(query);
        const matchTerms = r.chu_giai_tu_ngu_ban_dia.toLowerCase().includes(query);
        const matchId = r.id.toLowerCase().includes(query);

        if (!matchTitle && !matchLoc && !matchOldLoc && !matchCommunity && !matchDesc && !matchTerms && !matchId) {
          return false;
        }
      }

      return true;
    });
  }, [records, selectedRegion, selectedCategory, selectedMediaType, consentFilter, searchQuery]);

  // Export filtered list as JSON
  const handleExportFiltered = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `disan_filtered_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getMediaBadge = (type: MediaType) => {
    switch (type) {
      case 'Ảnh':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <ImageIcon className="w-3 h-3" />
            Ảnh
          </span>
        );
      case 'Ghi âm':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Volume2 className="w-3 h-3" />
            Ghi âm
          </span>
        );
      case 'Ghi hình':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Video className="w-3 h-3" />
            Ghi hình
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <FileText className="w-3 h-3" />
            Văn bản
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Stats Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1">
              <Compass className="w-4 h-4 text-amber-700" />
              KHO TƯ LIỆU SỐ HÓA DI SẢN
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-900 tracking-tight">
              Thư viện Di sản văn hóa phi vật thể 8 Vùng miền
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Tra cứu và rà soát các bản ghi di sản theo chuẩn 12 trường thông tin (Luật DSVH 2024). Tự động nhận diện và cảnh báo màu cam các tư liệu chưa hoàn tất thỏa thuận đồng thuận FPIC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportFiltered}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-4 h-4 text-amber-400" />
              Xuất kết quả ({filteredRecords.length} bản ghi)
            </button>
          </div>
        </div>

        {/* Quick Region Pills Bar */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Lọc theo 8 Vùng văn hóa Việt Nam:
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Hiển thị: {filteredRecords.length}/{records.length}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedRegion('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                selectedRegion === 'ALL'
                  ? 'bg-amber-900 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Tất cả vùng ({records.length})
            </button>
            {REGIONS.map((region) => {
              const count = records.filter((r) => r.di_san_lien_quan.includes(region)).length;
              const isSelected = selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {region} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên di sản, địa danh, nghệ nhân, thuật ngữ..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800 font-medium"
            >
              <option value="ALL">Tất cả loại di sản (Đ.10 Luật DSVH 2024)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Media Filter */}
          <div>
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800 font-medium"
            >
              <option value="ALL">Tất cả loại tư liệu</option>
              <option value="Ảnh">Ảnh tư liệu</option>
              <option value="Ghi âm">Ghi âm (Audio)</option>
              <option value="Ghi hình">Ghi hình (Video)</option>
              <option value="Văn bản">Văn bản / Bản thảo</option>
            </select>
          </div>

          {/* Warning / Consent Filter */}
          <div>
            <select
              value={consentFilter}
              onChange={(e) => setConsentFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-stone-800 font-medium"
            >
              <option value="ALL">Tất cả trạng thái bản quyền ({records.length})</option>
              <option value="CONSENTED">Chỉ bản ghi đã có đồng thuận (FPIC)</option>
              <option value="WARNING">
                ⚠️ Cảnh báo: Chưa đồng thuận / Chờ thẩm định ({warningCount})
              </option>
            </select>
          </div>
        </div>

        {/* Warning Indicator Banner if filter or warning active */}
        {warningCount > 0 && (
          <div className="flex items-center justify-between bg-amber-50/80 border border-amber-300/80 px-3.5 py-2 rounded-xl text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Hệ thống phát hiện <strong>{warningCount} bản ghi</strong> mang nhãn cảnh báo màu cam (chưa có đồng thuận hoặc đang rà soát nguồn).
              </span>
            </div>
            {consentFilter !== 'WARNING' && (
              <button
                onClick={() => setConsentFilter('WARNING')}
                className="text-amber-800 font-bold underline hover:text-amber-950"
              >
                Xem riêng các bản ghi này
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid of Heritage Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 space-y-3">
          <HelpCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="font-bold text-stone-700 text-base">Không tìm thấy bản ghi di sản phù hợp</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Vui lòng thử điều chỉnh lại bộ lọc vùng văn hóa, loại hình di sản hoặc từ khóa tìm kiếm.
          </p>
          <button
            onClick={() => {
              setSelectedRegion('ALL');
              setSelectedCategory('ALL');
              setSelectedMediaType('ALL');
              setConsentFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => {
            const hasWarning = !record.is_consented || record.nguon_goc_tu_lieu.includes('Chưa có');

            return (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                  hasWarning
                    ? 'border-amber-400/90 ring-1 ring-amber-400/30 hover:border-amber-500'
                    : 'border-stone-200 hover:border-amber-300'
                }`}
              >
                {/* Top Banner Warning or Status */}
                {hasWarning ? (
                  <div className="bg-amber-500 text-stone-950 px-3.5 py-1 text-[11px] font-bold flex items-center justify-between tracking-tight">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>CẢNH BÁO: CHƯA ĐỒNG THUẬN (is_consented: false)</span>
                    </div>
                    <span className="text-[10px] font-mono bg-stone-950/10 px-1.5 rounded">
                      Chờ FPIC
                    </span>
                  </div>
                ) : (
                  <div className="bg-stone-50 border-b border-stone-100 px-3.5 py-1 text-[10px] font-medium text-stone-500 flex items-center justify-between">
                    <span className="font-mono text-stone-400">Mã: {record.id}</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Đồng thuận FPIC
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Media badge & Related Heritage Category */}
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      {getMediaBadge(record.loai_tu_lieu)}
                      <span className="text-[11px] text-amber-800 font-semibold truncate max-w-[200px]">
                        {record.di_san_lien_quan.split('-')[0].trim()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heritage font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                      {record.ten_tu_lieu}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {record.noi_dung_mo_ta_ngan}
                    </p>
                  </div>

                  {/* Metadata pills */}
                  <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
                    {/* Field 5: Current Location */}
                    <div className="flex items-start gap-1.5 text-stone-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="font-semibold text-emerald-950 line-clamp-1">
                        {record.dia_danh_hien_nay}
                      </span>
                    </div>

                    {/* Field 6: Former Location */}
                    {record.dia_danh_thoi_diem_tu_lieu && (
                      <div className="flex items-start gap-1.5 text-stone-500 text-[11px]">
                        <History className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <span className="italic line-clamp-1">
                          Thời kỳ tư liệu: {record.dia_danh_thoi_diem_tu_lieu}
                        </span>
                      </div>
                    )}

                    {/* Field 9: Community & Artisan */}
                    <div className="flex items-start gap-1.5 text-stone-700 text-[11px]">
                      <Users className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium">
                        {record.nguoi_cung_cap_va_cong_dong}
                      </span>
                    </div>

                    {/* Field 12: Indigenous Terms */}
                    {record.chu_giai_tu_ngu_ban_dia && (
                      <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200/50 text-[11px] text-amber-900 line-clamp-1">
                        <strong className="font-semibold">Thuật ngữ:</strong> {record.chu_giai_tu_ngu_ban_dia}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-stone-50/70 border-t border-stone-100 px-5 py-2.5 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    {record.thoi_diem_thu_thap}
                  </span>
                  <span className="font-semibold text-amber-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px]">
                    Xem đủ 12 trường
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
