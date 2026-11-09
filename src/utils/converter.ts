import { HeritageRecord, MediaType } from '../types/heritage';

export interface RawSample {
  id: string;
  title: string;
  description: string;
  rawText: string;
}

export const SAMPLE_RAW_DATA: RawSample[] = [
  {
    id: 'sample-1',
    title: 'Ghi chép điền dã thô: Lễ Cấp sắc 7 đèn của người Dao đỏ',
    description: 'Sổ tay điền dã của cán bộ phòng văn hóa huyện Sa Pa ghi chép nghi thức trưởng thành',
    rawText: `NHẬT KÝ ĐIỀN DÃ DÂN TỘC HỌC
Thời gian: Ngày 15 tháng Chạp năm 2022 (15/12/2022)
Địa điểm ghi nhận: Thôn Tả Phìn, xã Tả Phìn, thị xã Sa Pa, tỉnh Lào Cai (trước kia thuộc Xã Tả Phìn, Huyện Sa Pa, Tỉnh Lào Cai).
Người ghi chép: Cử nhân Lù Văn Chung - Phòng VHTT Thị xã Sa Pa phối hợp Trung tâm Văn hóa Tỉnh.
Chủ lễ và người cung cấp: Thầy cúng Tán Vần Siệu (71 tuổi) cùng dòng họ Tán thôn Tả Phìn. Thầy cúng đồng ý cho ghi hình và làm hồ sơ di sản văn hóa, có biên bản xác nhận của già làng.
Tư liệu thu thập: 45 bức ảnh độ phân giải cao và video tư liệu nghi lễ quá tam nhật.
Nội dung: Lễ Quý Mỉn (Cấp sắc 7 đèn) cho 3 thanh niên dòng họ Tán. Nghi thức khẳng định người đàn ông Dao đỏ được thần linh Bàn Vương công nhận trưởng thành, có đạo sắc, được tham gia việc cúng tế của bản. Diễn ra liên tục 3 ngày 3 đêm với các điệu múa rùa, múa kiếm, lễ đặt tên âm.
Phân loại: Tập quán xã hội và tín ngưỡng theo Luật Di sản văn hóa - Thuộc Vùng văn hóa Tây Bắc.
Thuật ngữ tiếng Dao: "Quý Mỉn" là lễ cấp 7 đèn; "Sai chấy" là người được cấp sắc; "Bàn Vương" là thủy tổ của người Dao.
Phạm vi sử dụng: Được phép trưng bày triển lãm số, lưu trữ hồ sơ di sản quốc gia và nghiên cứu nhân học văn hóa.
Nguồn tham chiếu: Hồ sơ di sản phi vật thể cấp quốc gia số 12/DS-LC, Quyết định số 2684/QĐ-BVHTTDL.`
  },
  {
    id: 'sample-2',
    title: 'Bản thảo điền dã: Lễ hội Đua bò Bảy Núi (An Giang)',
    description: 'Tư liệu thô thu thập tại chùa Rô về lễ hội nông nghiệp Khmer Nam Bộ',
    rawText: `TƯ LIỆU THỰC HÀNH LỄ HỘI DÂN TỘC KHMER NAM BỘ
Tên thực hành: Lễ hội Đua bò Bảy Núi trong dịp lễ Sene Dolta của người Khmer.
Loại hình: Ghi hình thước phim tư liệu (video 4K) diễn biến hội đua.
Địa bàn hiện nay: Xã An Cư, Thị xã Tịnh Biên, Tỉnh An Giang.
Địa danh xưa: Làng An Cư, Quận Tri Tôn, Tỉnh Châu Đốc (thời kỳ trước 1975).
Ngày quay: 24/09/2023.
Cán bộ thu hình: ThS. Trương Quốc Dũng - Đài PTTH An Giang.
Cộng đồng chủ thể: Các nài bò thuộc Sóc Rô cùng Ban Quản trị Chùa Rô (Wat Rô), xã An Cư, Tịnh Biên. Trưởng ban Thượng tọa Chau Sóc Khonh.
Tình trạng đồng thuận: Đã ký bản cam kết đồng thuận cộng đồng (FPIC) cho phép truyền thông văn hóa dân tộc.
Mô tả tóm tắt: Đôi bò kéo bừa gỗ (nhang) tranh tài trên ruộng nước sình lầy ngập mắt cá chân. Gồm 2 vòng: vòng hô (điều khiển chạy chậm giữ thăng bằng) và vòng thả (bứt tốc phóng hết tốc lực về đích). Là nét sinh hoạt văn hóa tín ngưỡng nông nghiệp tạ ơn tổ tiên và các vị thần bảo hộ đồng ruộng.
Loại di sản: Lễ hội truyền thống (Điều 10 Luật DSVH 2024) - Vùng văn hóa Tây Nam Bộ.
Từ bản địa: "Sene Dolta" là lễ báo hiếu ông bà tổ tiên; "Nhang" là chiếc bừa kéo đặc thù gắn đôi bò đua.
Hồ sơ nguồn: Quyết định số 1852/QĐ-BVHTTDL ngày 08/05/2017 công nhận Di sản phi vật thể quốc gia.`
  },
  {
    id: 'sample-3',
    title: 'Biên bản chưa xác thực đầy đủ: Hát Sắc bùa Bến Tre',
    description: 'Bản ghi chép điền dã chưa có biên bản đồng thuận chính thức của các nghệ nhân',
    rawText: `PHIẾU GHI NHẬN TẬP TỤC ĐẦU NĂM
Tên tư liệu: Điệu Hát Sắc bùa chúc xuân đầu năm của đội hát bùa họ Lê.
Hình thức lưu trữ: Bản ghi âm cassette cổ năm 1996 và văn bản chép tay lời ca.
Địa phương hiện nay: Xã Phú Lễ, Huyện Ba Tri, Tỉnh Bến Tre.
Địa danh cũ: Xã Phú Lễ, Tổng Bảo An, Tỉnh Kiến Hòa (1960).
Thời gian sưu tầm: Tháng 02/1996.
Người thu thập: Ông Trần Hữu Đức (sưu tầm tư nhân độc lập).
Chủ thể: Cụ Lê Văn Sanh (đã mất) cùng một số thành viên trong họ tộc họ Lê xã Phú Lễ. Chưa có chữ ký xác nhận của đại diện chính thức thôn xóm và chính quyền cơ sở, đang có tranh chấp bản quyền văn bản.
Trạng thái xin phép: Chưa có biên bản đồng thuận chính thức của hội đồng cộng đồng (is_consented = false).
Cảnh báo lưu ý: Nguồn gốc tư liệu thuộc bộ sưu tập cá nhân, chưa được thẩm định qua Hội đồng khoa học Cục Di sản văn hóa.
Nội dung ngắn gọn: Đội hát sắc bùa gồm 4 đến 6 người vừa đánh trống cơm, sênh tiền vừa hát các bài văn vần chúc tụng gia chủ năm mới bình an, xua đuổi tà ma và dán lá bùa nêu trước ngõ.
Loại hình: Nghệ thuật trình diễn dân gian & Tập quán xã hội - Vùng văn hóa Tây Nam Bộ.
Tiếng bản địa: "Sắc bùa" là dán lá bùa trừ tà kết hợp hát xướng chúc xuân.`
  }
];

export function parseRawHeritageHeuristically(rawText: string): HeritageRecord {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  let ten_tu_lieu = 'Di sản văn hóa phi vật thể (Chờ cập nhật)';
  let loai_tu_lieu: MediaType = 'Văn bản';
  let noi_dung_mo_ta_ngan = '';
  let di_san_lien_quan = 'Tập quán xã hội và tín ngưỡng (Điều 10 Luật DSVH 2024) - Vùng văn hóa Châu thổ Bắc Bộ';
  let dia_danh_hien_nay = 'Xã/Phường, Huyện/Quận, Tỉnh/Thành phố';
  let dia_danh_thoi_diem_tu_lieu = 'Địa danh tại thời điểm thu thập tư liệu';
  let thoi_diem_thu_thap = new Date().getFullYear().toString();
  let nguoi_thu_thap = 'Cán bộ quản lý di sản';
  let nguoi_cung_cap_va_cong_dong = 'Nghệ nhân & Cộng đồng chủ thể';
  let pham_vi_su_dung = 'Được phép sử dụng cho nghiên cứu khoa học và bảo tồn phi thương mại';
  let is_consented = true;
  let nguon_goc_tu_lieu = 'Hồ sơ lưu trữ di sản cơ sở';
  let chu_giai_tu_ngu_ban_dia = 'Đang rà soát thuật ngữ bản địa';

  // Extract Title
  for (const line of lines) {
    if (/(tên thực hành|tên di sản|tên tư liệu|nhật ký điền dã|tiêu đề):?/i.test(line)) {
      ten_tu_lieu = line.replace(/^(tên thực hành|tên di sản|tên tư liệu|nhật ký điền dã|tiêu đề):?\s*/i, '').trim();
      break;
    }
  }
  if (ten_tu_lieu === 'Di sản văn hóa phi vật thể (Chờ cập nhật)' && lines.length > 0) {
    ten_tu_lieu = lines[0].replace(/^#+\s*/, '').trim();
  }

  // Extract Media Type
  const lower = rawText.toLowerCase();
  if (lower.includes('ghi hình') || lower.includes('video') || lower.includes('thước phim')) {
    loai_tu_lieu = 'Ghi hình';
  } else if (lower.includes('ghi âm') || lower.includes('thu âm') || lower.includes('cassette') || lower.includes('audio')) {
    loai_tu_lieu = 'Ghi âm';
  } else if (lower.includes('bức ảnh') || lower.includes('chụp ảnh') || lower.includes('ảnh tư liệu') || lower.includes('tập ảnh')) {
    loai_tu_lieu = 'Ảnh';
  } else {
    loai_tu_lieu = 'Văn bản';
  }

  // Extract Current Location
  for (const line of lines) {
    if (/(địa bàn hiện nay|địa điểm ghi nhận|địa danh hiện nay|địa phương hiện nay):?/i.test(line)) {
      dia_danh_hien_nay = line.replace(/^(địa bàn hiện nay|địa điểm ghi nhận|địa danh hiện nay|địa phương hiện nay):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Old Location
  for (const line of lines) {
    if (/(địa danh xưa|địa danh cũ|thời điểm tư liệu):?/i.test(line)) {
      dia_danh_thoi_diem_tu_lieu = line.replace(/^(địa danh xưa|địa danh cũ|thời điểm tư liệu):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Date
  for (const line of lines) {
    if (/(thời gian|ngày quay|thời điểm|thời điểm thu thập):?/i.test(line)) {
      thoi_diem_thu_thap = line.replace(/^(thời gian|ngày quay|thời điểm|thời điểm thu thập):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Collector
  for (const line of lines) {
    if (/(người ghi chép|cán bộ|người thu thập|người sưu tầm):?/i.test(line)) {
      nguoi_thu_thap = line.replace(/^(người ghi chép|cán bộ|người thu thập|người sưu tầm):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Community & Artisan
  for (const line of lines) {
    if (/(chủ lễ và người cung cấp|cộng đồng chủ thể|chủ thể|người cung cấp):?/i.test(line)) {
      nguoi_cung_cap_va_cong_dong = line.replace(/^(chủ lễ và người cung cấp|cộng đồng chủ thể|chủ thể|người cung cấp):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Consent
  if (lower.includes('chưa có biên bản') || lower.includes('chưa có chữ ký') || lower.includes('chưa đồng thuận') || lower.includes('chưa được phép') || lower.includes('is_consented = false')) {
    is_consented = false;
  } else {
    is_consented = true;
  }

  // Extract Description
  for (const line of lines) {
    if (/(nội dung|mô tả tóm tắt|mô tả ngắn):?/i.test(line)) {
      noi_dung_mo_ta_ngan = line.replace(/^(nội dung|mô tả tóm tắt|mô tả ngắn):?\s*/i, '').trim();
      break;
    }
  }
  if (!noi_dung_mo_ta_ngan) {
    // Pick the longest descriptive paragraph
    const longLines = lines.filter((l) => l.length > 50 && !l.includes(':'));
    if (longLines.length > 0) {
      noi_dung_mo_ta_ngan = longLines[0];
    } else {
      noi_dung_mo_ta_ngan = rawText.slice(0, 180) + '...';
    }
  }

  // Extract Region and Category
  let region = 'Tây Bắc';
  if (lower.includes('tây bắc')) region = 'Tây Bắc';
  else if (lower.includes('việt bắc')) region = 'Việt Bắc';
  else if (lower.includes('châu thổ bắc bộ') || lower.includes('đồng bằng bắc bộ')) region = 'Châu thổ Bắc Bộ';
  else if (lower.includes('bắc trung bộ')) region = 'Bắc Trung Bộ';
  else if (lower.includes('duyên hải nam trung bộ') || lower.includes('nam trung bộ')) region = 'Duyên hải Nam Trung Bộ';
  else if (lower.includes('tây nguyên')) region = 'Tây Nguyên';
  else if (lower.includes('đông nam bộ')) region = 'Đông Nam Bộ';
  else if (lower.includes('tây nam bộ') || lower.includes('nam bộ') || lower.includes('khmer')) region = 'Tây Nam Bộ';

  let category = 'Tập quán xã hội và tín ngưỡng';
  if (lower.includes('lễ hội')) category = 'Lễ hội truyền thống';
  else if (lower.includes('nghệ thuật trình diễn') || lower.includes('hát') || lower.includes('xòe') || lower.includes('múa') || lower.includes('nhạc')) category = 'Nghệ thuật trình diễn dân gian';
  else if (lower.includes('nghề') || lower.includes('gốm') || lower.includes('dệt') || lower.includes('sáp ong') || lower.includes('thủ công')) category = 'Nghề thủ công truyền thống';
  else if (lower.includes('sử thi') || lower.includes('truyện') || lower.includes('văn học')) category = 'Ngữ văn dân gian';
  else if (lower.includes('tri thức') || lower.includes('thuốc nam')) category = 'Tri thức dân gian';
  else if (lower.includes('chữ viết') || lower.includes('tiếng nói')) category = 'Tiếng nói, chữ viết';

  di_san_lien_quan = `${category} (Điều 10 Luật DSVH 2024) - Vùng văn hóa ${region}`;

  // Extract Source
  for (const line of lines) {
    if (/(nguồn tham chiếu|hồ sơ nguồn|nguồn gốc tư liệu|quyết định):?/i.test(line)) {
      nguon_goc_tu_lieu = line.replace(/^(nguồn tham chiếu|hồ sơ nguồn|nguồn gốc tư liệu):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Indigenous Terms
  for (const line of lines) {
    if (/(thuật ngữ tiếng|từ bản địa|tiếng bản địa|chú giải):?/i.test(line)) {
      chu_giai_tu_ngu_ban_dia = line.replace(/^(thuật ngữ tiếng [^:]+|từ bản địa|tiếng bản địa|chú giải):?\s*/i, '').trim();
      break;
    }
  }

  // Extract Scope of Use
  for (const line of lines) {
    if (/(phạm vi sử dụng|phạm vi được phép):?/i.test(line)) {
      pham_vi_su_dung = line.replace(/^(phạm vi sử dụng|phạm vi được phép):?\s*/i, '').trim();
      break;
    }
  }

  return {
    id: `DS-CONVERTED-${Date.now().toString().slice(-4)}`,
    ten_tu_lieu,
    loai_tu_lieu,
    noi_dung_mo_ta_ngan,
    di_san_lien_quan,
    dia_danh_hien_nay,
    dia_danh_thoi_diem_tu_lieu,
    thoi_diem_thu_thap,
    nguoi_thu_thap,
    nguoi_cung_cap_va_cong_dong,
    pham_vi_su_dung,
    is_consented,
    nguon_goc_tu_lieu,
    chu_giai_tu_ngu_ban_dia,
  };
}
