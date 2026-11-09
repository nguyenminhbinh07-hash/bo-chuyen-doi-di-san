import React from 'react';
import {
  Award,
  Compass,
  CheckCircle,
  GraduationCap,
  Building2,
  Heart,
  Scale,
  BadgeCheck,
  Quote
} from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* DUY NHẤT 1 KHUNG GIỚI THIỆU TÁC GIẢ GỌN GÀNG & ĐẸP MẮT */}
      <section className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 border border-amber-600/40 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              Thông tin Tác giả & Bản quyền Dự án
            </div>
            <span className="text-xs text-amber-300/90 font-medium">
              Dự án Số hóa Di sản Văn hóa
            </span>
          </div>

          {/* Profile Row: Avatar + Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Monogram */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex flex-col items-center justify-center text-amber-300 font-heritage font-bold text-xl sm:text-2xl">
                  NMB
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-stone-950 p-0.5 rounded-full border-2 border-stone-900" title="Chính chủ">
                <BadgeCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Main Identity */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-white tracking-tight">
                  Nguyễn Minh Bình
                </h1>
                <span className="bg-amber-400 text-stone-950 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Phó nhóm 2
                </span>
                <span className="bg-white/10 text-amber-200 border border-white/15 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  Mã SV: TH04121
                </span>
              </div>

              {/* 3 Key Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-stone-300">
                    Thực tập sinh <strong>Đợt 15</strong>
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-stone-300 truncate">
                    <strong>FPT Polytechnic</strong> & <strong>IMTA TECH</strong>
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-stone-300">
                    Dự án xã hội <strong>phi lợi nhuận</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Quote Notice */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs sm:text-sm text-amber-100 flex items-start gap-3">
            <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">
              “Sản phẩm thực tập của Nguyễn Minh Bình - Mã sinh viên: TH04121 - Phó nhóm 2. Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH. Dự án xã hội phi lợi nhuận.”
            </p>
          </div>
        </div>
      </section>

      {/* Project Background & Mission */}
      <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
            Bối cảnh & Sứ mệnh Đề tài
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900 tracking-tight">
            Số hóa Di sản Văn hóa Phi vật thể 8 Vùng miền Việt Nam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <p>
            Việt Nam là quốc gia đa dân tộc với kho tàng Di sản văn hóa phi vật thể vô cùng phong phú và độc đáo trải dài qua 8 vùng văn hóa đặc thù. Tuy nhiên, dữ liệu thu thập từ các chuyến điền dã của cán bộ bảo tàng, nhà nghiên cứu cơ sở hoặc cộng đồng thường rời rạc, không đồng nhất về cấu trúc, thiếu chuẩn hóa về địa danh hành chính hoặc chưa xác lập rõ ràng quyền đồng thuận tự nguyện của nghệ nhân chủ thể (FPIC).
          </p>
          <p>
            Hệ thống <strong>"Bộ chuyển đổi dữ liệu di sản sang chuẩn mô tả chung"</strong> ra đời nhằm thiết lập một chuẩn 12 trường dữ liệu thống nhất, tuân thủ nghiêm ngặt <em>Luật Di sản văn hóa 2024</em>, tích hợp trợ lý AI tra cứu có kiểm soát chống bịa đặt (Anti-Hallucination), hỗ trợ bảo tồn bền vững và lan tỏa tri thức bản địa đến thế hệ trẻ.
          </p>
        </div>

        {/* 8 Cultural Regions Grid */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-700" />
            Không gian 8 Vùng văn hóa Việt Nam trong hệ thống
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">1. Tây Bắc</span>
              <span className="text-[11px] text-stone-500">Xòe Thái, hoa văn sáp ong Mông...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">2. Việt Bắc</span>
              <span className="text-[11px] text-stone-500">Thực hành Then Tày-Nùng, Lễ hội Lồng Tồng...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">3. Châu thổ Bắc Bộ</span>
              <span className="text-[11px] text-stone-500">Quan họ, Hát Xoan, Tranh Đông Hồ, Ca trù...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">4. Bắc Trung Bộ</span>
              <span className="text-[11px] text-stone-500">Dân ca Ví Giặm Nghệ Tĩnh, Hò Cảnh Dương...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">5. Duyên hải Nam Trung Bộ</span>
              <span className="text-[11px] text-stone-500">Nghệ thuật Bài Chòi, Gốm Chăm Bàu Trúc...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">6. Tây Nguyên</span>
              <span className="text-[11px] text-stone-500">Cồng chiêng Tây Nguyên, Sử thi Klei Khan...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">7. Đông Nam Bộ</span>
              <span className="text-[11px] text-stone-500">Đờn ca tài tử, Lễ hội Nghinh Ông Cần Giờ...</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
              <span className="font-bold text-amber-900 block">8. Tây Nam Bộ</span>
              <span className="text-[11px] text-stone-500">Dạ cổ hoài lang, Ok Om Bok Khmer, Bánh tráng...</span>
            </div>
          </div>
        </div>
      </section>

      {/* 12 Standard Fields Table Documentation */}
      <section className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
            Quy chuẩn kỹ thuật dữ liệu
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900 tracking-tight">
            Đặc tả 12 Trường Thông tin Chuẩn (disan.json)
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Mỗi bản ghi di sản phi vật thể đều phải thỏa mãn 12 trường bắt buộc sau đây theo Luật Di sản văn hóa 2024:
          </p>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-xs text-left text-stone-800">
            <thead className="text-[11px] uppercase bg-stone-100 text-stone-700 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 font-bold w-12 text-center">STT</th>
                <th className="px-4 py-3 font-bold w-48">Tên trường tiếng Việt</th>
                <th className="px-4 py-3 font-bold w-48 font-mono">Mã khóa (JSON Key)</th>
                <th className="px-4 py-3 font-bold">Mô tả quy chuẩn & Lưu ý nghiệp vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-700">
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">1</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Tên tư liệu</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">ten_tu_lieu</td>
                <td className="px-4 py-2.5">Tên di sản / thực hành văn hóa chính thức theo danh mục kiểm kê.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">2</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Loại tư liệu</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">loai_tu_lieu</td>
                <td className="px-4 py-2.5">Định dạng tư liệu: Ảnh, Ghi âm, Ghi hình hoặc Văn bản.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">3</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Nội dung mô tả ngắn</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">noi_dung_mo_ta_ngan</td>
                <td className="px-4 py-2.5">Tóm tắt giá trị lịch sử, nghi thức, nghệ thuật và diễn trình thực hành.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">4</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Di sản liên quan</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">di_san_lien_quan</td>
                <td className="px-4 py-2.5">Thuộc loại hình di sản phi vật thể (Đ.10 Luật DSVH 2024) & Vùng văn hóa cụ thể.</td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="px-4 py-2.5 text-center font-bold text-emerald-700">5</td>
                <td className="px-4 py-2.5 font-bold text-emerald-950">Địa danh hiện nay</td>
                <td className="px-4 py-2.5 font-mono text-emerald-900 font-bold">dia_danh_hien_nay</td>
                <td className="px-4 py-2.5 font-medium text-emerald-950">Ghi chính xác 34 tỉnh/thành phố và đủ 2 cấp hành chính hiện tại (Xã/Phường, Huyện/Quận).</td>
              </tr>
              <tr className="bg-amber-50/40">
                <td className="px-4 py-2.5 text-center font-bold text-amber-700">6</td>
                <td className="px-4 py-2.5 font-bold text-amber-950">Địa danh thời điểm tư liệu</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-bold">dia_danh_thoi_diem_tu_lieu</td>
                <td className="px-4 py-2.5 font-medium text-amber-950">Tên địa danh cũ hoặc tên bản địa đúng mốc thời gian thu thập tư liệu.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">7</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Thời điểm thu thập</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">thoi_diem_thu_thap</td>
                <td className="px-4 py-2.5">Tháng/năm hoặc mốc lịch sử thực hiện điền dã sưu tầm.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">8</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Người thu thập</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">nguoi_thu_thap</td>
                <td className="px-4 py-2.5">Họ tên cán bộ, nhà nghiên cứu, đơn vị hoặc viện chuyên môn thực hiện.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">9</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Người cung cấp & Cộng đồng</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">nguoi_cung_cap_va_cong_dong</td>
                <td className="px-4 py-2.5">Nghệ nhân, dòng họ, buôn, bản, vạn chài hoặc làng nghề cụ thể (không ghi chung chung).</td>
              </tr>
              <tr className="bg-amber-50/30">
                <td className="px-4 py-2.5 text-center font-bold text-amber-700">10</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Phạm vi & Xin phép (is_consented)</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-bold">is_consented (boolean)</td>
                <td className="px-4 py-2.5">Bắt buộc xác định trạng thái boolean (true: đã có đồng thuận; false: cảnh báo cam).</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">11</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Nguồn gốc tư liệu</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">nguon_goc_tu_lieu</td>
                <td className="px-4 py-2.5">URL, quyết định công nhận của Bộ VHTTDL, bảo tàng hoặc tài liệu tham khảo chính thống.</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-center font-bold text-stone-400">12</td>
                <td className="px-4 py-2.5 font-bold text-stone-900">Chú giải từ ngữ bản địa</td>
                <td className="px-4 py-2.5 font-mono text-amber-900 font-semibold">chu_giai_tu_ngu_ban_dia</td>
                <td className="px-4 py-2.5">Giải thích các thuật ngữ gốc của đồng bào dân tộc thiểu số hoặc phương ngữ cổ.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Ethical Code of Conduct */}
      <section className="bg-stone-900 text-stone-200 rounded-3xl p-6 sm:p-8 border border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          Cam kết Đạo đức và Chống Bịa đặt (Zero-Hallucination Policy)
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Ứng dụng tôn trọng triệt để quyền sở hữu văn hóa của các cộng đồng bản địa theo nguyên tắc FPIC (Tự nguyện, Trước và Được thông tin đầy đủ). Mô hình AI Gemini được neo vững chắc (grounded) trên cơ sở dữ liệu xác thực, tuyệt đối không suy đoán hay sinh ảnh nghệ nhân giả mạo, bảo vệ tính trung thực và thiêng liêng của di sản dân tộc.
        </p>
      </section>
    </div>
  );
};
