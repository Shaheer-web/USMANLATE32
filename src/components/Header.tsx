import React from 'react';
import { NavigationTab } from '../types';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  MessageSquareHeart, 
  BookOpen, 
  Lock, 
  Unlock 
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isAdminUnlocked: boolean;
  onLockAdmin: () => void;
  onRequestAdmin: () => void;
  warningCount: number;
  totalLateCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  onLockAdmin,
  onRequestAdmin,
  warningCount,
  totalLateCount,
}) => {
  const publicNavItems = [
    { 
      id: 'dashboard' as NavigationTab, 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      badge: totalLateCount > 0 ? totalLateCount : null 
    },
    { 
      id: 'warning' as NavigationTab, 
      label: 'Warning Registry', 
      icon: ShieldAlert, 
      badge: warningCount > 0 ? warningCount : null, 
      alertColor: true 
    },
    { 
      id: 'suggestions' as NavigationTab, 
      label: 'Suggestions', 
      icon: MessageSquareHeart 
    },
    { 
      id: 'journey' as NavigationTab, 
      label: 'Rules & Journey', 
      icon: BookOpen 
    },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    if (tabId === 'management' && !isAdminUnlocked) {
      onRequestAdmin();
    } else {
      setActiveTab(tabId);
    }
  };

  const isManagementActive = activeTab === 'management';

  return (
    <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-md border-b-4 border-amber-500 sticky top-0 z-40">
      {/* Clean, spacious branding bar (No cluttered top ribbon or redundant links) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        {/* School Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden bg-white p-0.5 shadow-md border-2 border-amber-400 ring-2 ring-emerald-950/40 shrink-0">
            <img
              src="/upss-logo.jpg"
              alt="Usman Public School System Official Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://yt3.googleusercontent.com/5hpubYiQhsYGv5Z0TQeT4QC2eG1W84B9IpUHQh0vZFmPfnkDTeiY04SWdsgJm04yfbFpbxaYew=s900-c-k-c0x00ffffff-no-rj';
              }}
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white font-serif leading-tight">
              Usman C-32
            </h1>
            <p className="text-xs text-emerald-200/90 font-medium truncate mt-0.5">
              Punctuality Ledger &bull; <span className="text-amber-300 font-serif">بَابُ الْانْضِبَاطِ</span>
            </p>
          </div>
        </div>

        {/* Right Action: Admin Security Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdminUnlocked ? (
            <button
              onClick={onLockAdmin}
              className="flex items-center gap-1.5 text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-3 py-1.5 rounded-xl border border-amber-500/50 text-xs font-bold transition shadow-xs cursor-pointer"
              title="Click to lock admin privileges"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Active</span>
              <span className="bg-emerald-800 text-white px-1.5 py-0.2 rounded text-[9px]">Lock</span>
            </button>
          ) : (
            <button
              onClick={onRequestAdmin}
              className="flex items-center gap-1.5 text-emerald-100 hover:text-white bg-emerald-800/80 hover:bg-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-700 text-xs font-semibold transition shadow-xs cursor-pointer"
              title="Admin Security Login"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar: Spacious, open ("khulla"), touch-friendly */}
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between border-t border-emerald-800/70 overflow-x-auto scrollbar-none touch-pan-x">
        {/* Left Side: Public Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 min-w-max">
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer relative whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#f7f9f7] text-emerald-950 shadow-sm border border-emerald-300 font-bold'
                    : 'text-emerald-100/90 hover:text-white hover:bg-emerald-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                <span>{item.label}</span>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.alertColor
                        ? 'bg-rose-500 text-white shadow-xs'
                        : isActive
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-950 text-amber-300 border border-emerald-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Management Panel Tab */}
        <div className="pl-3 shrink-0 py-2 sm:py-2.5">
          <button
            id="tab-btn-management"
            onClick={() => handleTabClick('management')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-95 ${
              isManagementActive
                ? 'bg-amber-400 text-emerald-950 shadow-sm'
                : 'text-amber-300 hover:text-amber-200 hover:bg-emerald-800/60 border border-amber-400/40 bg-emerald-900/60'
            }`}
          >
            {isAdminUnlocked ? (
              <Unlock className="w-4 h-4 text-emerald-950 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <span>Management</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
