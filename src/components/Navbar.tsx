import React from 'react';
import {
  Sparkles,
  Database,
  Bot,
  Layers,
  Info,
  Compass
} from 'lucide-react';

export type ScreenTab = 'converter' | 'library' | 'ai-qa' | 'sources' | 'about';

interface NavbarProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  totalRecordsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  totalRecordsCount,
}) => {
  const navItems: {
    id: ScreenTab;
    title: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'converter',
      title: 'Chuyển đổi Dữ liệu',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'library',
      title: 'Thư viện Di sản',
      icon: <Database className="w-4 h-4" />,
      badge: `${totalRecordsCount}`,
    },
    {
      id: 'ai-qa',
      title: 'Hỏi đáp AI Gemini',
      icon: <Bot className="w-4 h-4" />,
      badge: 'AI',
    },
    {
      id: 'sources',
      title: 'Nguồn Tư liệu',
      icon: <Layers className="w-4 h-4" />,
      badge: '8',
    },
    {
      id: 'about',
      title: 'Giới thiệu & Bản quyền',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-amber-900/40 text-stone-100 shadow-lg">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-200 text-[11px] py-1.5 px-4 font-medium border-b border-amber-800/40 tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-100 truncate">
            HỆ THỐNG SỐ HÓA & CHUYỂN ĐỔI DI SẢN PHI VẬT THỂ 8 VÙNG MIỀN
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-300/80 font-mono">
          <span>Chuẩn hóa 12 trường</span>
          <span>•</span>
          <span>Luật Di sản văn hóa 2024</span>
        </div>
      </div>

      {/* Main Bar: Brand + Current Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Logo & Brand */}
          <div
            onClick={() => onTabChange('converter')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-800 flex items-center justify-center text-amber-100 shadow-inner border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-heritage text-base sm:text-lg text-white tracking-tight">
                  Di Sản Việt Nam
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-normal truncate max-w-[220px] sm:max-w-xs">
                Bộ chuyển đổi dữ liệu di sản sang chuẩn mô tả chung
              </p>
            </div>
          </div>

          {/* Quick Active Section Indicator */}
          <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700/60">
            <span className="text-[11px] text-stone-400 hidden md:inline">Đang xem:</span>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {navItems.find((n) => n.id === currentTab)?.title}
            </span>
          </div>
        </div>
      </div>

      {/* ALWAYS VISIBLE CLEAN NAVIGATION STRIP */}
      <nav className="bg-stone-950/90 border-t border-stone-800/80 px-2 sm:px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-1 min-w-[120px] sm:min-w-[150px] md:min-w-0 flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-800 text-white border border-amber-600/70 shadow-md font-semibold'
                    : 'bg-stone-900/60 hover:bg-stone-800/80 text-stone-300 border border-stone-800 hover:border-stone-700'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 ${
                    active
                      ? 'bg-amber-700 text-amber-200'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-xs font-bold truncate">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                        active
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
