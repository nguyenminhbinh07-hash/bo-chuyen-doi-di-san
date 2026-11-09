import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { ScreenTab } from './Navbar';

interface FooterProps {
  onNavigate: (tab: ScreenTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-amber-200" />
              </div>
              <span className="text-lg font-bold font-heritage text-white">
                Bộ Chuyển Đổi Dữ Liệu Di Sản Sang Chuẩn Mô Tả Chung
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-amber-400">
              Danh Mục Chức Năng
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('converter')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Chuyển đổi dữ liệu thô sang chuẩn 12 trường
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('library')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Thư viện di sản 8 vùng văn hóa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-qa')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Trợ lý AI Gemini tra cứu di sản
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sources')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Hệ thống nguồn tư liệu chính thống
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Thông tin giới thiệu & Bản quyền
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Standards */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3 text-amber-400">
              Tiêu Chuẩn Áp Dụng
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Luật Di sản Văn hóa 2024 (Điều 10)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Công ước UNESCO 2003 (ICH)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Chuẩn 12 trường dữ liệu disan.json</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Nguyên tắc đồng thuận FPIC cộng đồng</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Quy định địa danh 2 cấp hành chính</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 - Bộ chuyển đổi dữ liệu di sản sang chuẩn mô tả chung. Dự án xã hội phi lợi nhuận.</p>
          <div className="flex items-center gap-4 text-stone-400 text-xs">
            <span>FPT Polytechnic & IMTA TECH Đợt 15</span>
            <span>•</span>
            <span className="text-amber-400">Nguyễn Minh Bình (TH04121)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
