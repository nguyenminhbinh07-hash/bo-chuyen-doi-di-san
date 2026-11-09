export type CulturalRegion =
  | 'Tây Bắc'
  | 'Việt Bắc'
  | 'Châu thổ Bắc Bộ'
  | 'Bắc Trung Bộ'
  | 'Duyên hải Nam Trung Bộ'
  | 'Tây Nguyên'
  | 'Đông Nam Bộ'
  | 'Tây Nam Bộ';

export type MediaType = 'Ảnh' | 'Ghi âm' | 'Ghi hình' | 'Văn bản';

export type HeritageCategory =
  | 'Tiếng nói, chữ viết'
  | 'Ngữ văn dân gian'
  | 'Nghệ thuật trình diễn dân gian'
  | 'Tập quán xã hội và tín ngưỡng'
  | 'Lễ hội truyền thống'
  | 'Nghề thủ công truyền thống'
  | 'Tri thức dân gian';

export interface HeritageRecord {
  id: string;
  ten_tu_lieu: string; // 1. Tên tư liệu
  loai_tu_lieu: MediaType; // 2. Loại tư liệu (Ảnh / Ghi âm / Ghi hình / Văn bản)
  noi_dung_mo_ta_ngan: string; // 3. Nội dung mô tả ngắn
  di_san_lien_quan: string; // 4. Di sản liên quan (Điều 10 Luật DSVH 2024 & Vùng văn hóa cụ thể)
  dia_danh_hien_nay: string; // 5. Địa danh hiện nay (34 tỉnh/thành & 2 cấp hành chính)
  dia_danh_thoi_diem_tu_lieu: string; // 6. Địa danh tại thời điểm tư liệu
  thoi_diem_thu_thap: string; // 7. Thời điểm thu thập
  nguoi_thu_thap: string; // 8. Người thu thập
  nguoi_cung_cap_va_cong_dong: string; // 9. Người cung cấp & Cộng đồng di sản
  pham_vi_su_dung: string; // 10a. Phạm vi được phép sử dụng
  is_consented: boolean; // 10b. Trạng thái xin phép (is_consented: boolean)
  nguon_goc_tu_lieu: string; // 11. Nguồn gốc tư liệu
  chu_giai_tu_ngu_ban_dia: string; // 12. Chú giải từ ngữ bản địa
}

export interface HeritageSource {
  id: string;
  ten_to_chuc: string;
  co_quan_chu_quan: string;
  vai_tro_tham_dinh: string;
  website_url: string;
  tieu_chuan_trich_dan: string;
  so_luong_ho_so_tham_chieu: string;
  linh_vuc_chinh: string;
  mo_ta: string;
  bieu_tuong: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  heritageMetadata?: {
    ten_di_san?: string;
    vung_van_hoa?: string;
    cong_dong?: string;
    nguon_tu_lieu?: string;
    recordId?: string;
  };
  isOutOfScope?: boolean;
}
