import React from 'react';
import { NavigationTab } from '../types';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  FileEdit, 
  MessageSquareHeart, 
  BookOpen, 
  Lock, 
  Unlock,
  ExternalLink,
  ShieldCheck
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
  // Public tabs on the main navigation
  const publicNavItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard, badge: totalLateCount > 0 ? totalLateCount : null },
    { id: 'warning' as NavigationTab, label: 'Warning Registry', icon: ShieldAlert, badge: warningCount > 0 ? warningCount : null, alertColor: true },
    { id: 'suggestions' as NavigationTab, label: 'Suggestions Board', icon: MessageSquareHeart },
    { id: 'journey' as NavigationTab, label: 'About Our Journey & Rules', icon: BookOpen },
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
    <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl border-b-4 border-amber-500 sticky top-0 z-40">
      {/* Top golden announcement ribbon */}
      <div className="bg-emerald-950/95 border-b border-emerald-800/60 px-4 py-1.5 text-xs text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-medium text-amber-300">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden sm:inline text-emerald-400">|</span>
            <span className="hidden sm:inline text-emerald-300">Campus 32 (Girls Only, Class VI - X) &bull; Nazimabad No. 4, Karachi</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.youtube.com/c/UsmanPublicSchoolSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-amber-300 transition"
              title="Visit official Usman Public School System YouTube Channel"
            >
              <span>Official Channel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {isAdminUnlocked ? (
              <button
                onClick={onLockAdmin}
                className="flex items-center gap-1.5 text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-xs transition cursor-pointer"
                title="Click to lock admin privileges"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Unlocked</span>
                <span className="text-[10px] bg-emerald-800 px-1.5 rounded text-white ml-1">Lock</span>
              </button>
            ) : (
              <button
                onClick={onRequestAdmin}
                className="flex items-center gap-1.5 text-emerald-300 hover:text-white bg-emerald-900/70 hover:bg-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-700 text-xs transition cursor-pointer"
                title="Admin Security Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* School Logo & Title */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Official Circular School Logo */}
            <a
              href="https://www.youtube.com/c/UsmanPublicSchoolSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex-shrink-0"
              title="Usman Public School System - Official YouTube & Campus Hub"
            >
              <div className="w-13 h-13 md:w-15 md:h-15 rounded-full overflow-hidden bg-white p-0.5 shadow-lg border-2 border-amber-400 ring-2 ring-emerald-950/40 group-hover:scale-105 transition-transform duration-200">
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
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border border-emerald-950 flex items-center justify-center text-[9px] font-bold text-emerald-950 shadow-xs">
                ✓
              </span>
            </a>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white font-serif truncate sm:whitespace-normal">
                  Usman Public School System
                </h1>
                <span className="inline-flex items-center text-[9px] sm:text-[11px] font-semibold uppercase px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  Campus 32
                </span>
              </div>
              <p className="text-[11px] sm:text-xs md:text-sm text-emerald-200/90 font-medium truncate sm:whitespace-normal">
                Punctuality & Late Ledger &bull; <span className="text-amber-300 font-semibold">بَابُ الْانْضِبَاطِ</span>
              </p>
            </div>
          </div>

          {/* Mobile Admin button */}
          <div className="md:hidden">
            {isAdminUnlocked ? (
              <button
                onClick={onLockAdmin}
                className="p-2 rounded-lg bg-emerald-800 text-amber-300 text-xs flex items-center gap-1 border border-emerald-700"
                title="Lock admin privileges"
              >
                <Unlock className="w-4 h-4 text-emerald-300" />
              </button>
            ) : (
              <button
                onClick={onRequestAdmin}
                className="p-2 rounded-lg bg-emerald-950 text-amber-400 text-xs flex items-center gap-1 border border-emerald-700"
                title="Admin login"
              >
                <Lock className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Summary Pill on Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-emerald-950/80 border border-emerald-800 rounded-lg px-3 py-1.5 text-right">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Late Logged</span>
            <span className="text-sm font-bold text-white">{totalLateCount} Entries</span>
          </div>
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-lg px-3 py-1.5 text-right">
            <span className="text-[10px] text-amber-300 uppercase tracking-wider block">3-Times Alert</span>
            <span className="text-sm font-bold text-amber-300">{warningCount} Flagged</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar: Responsive Touch-Friendly Tabs with smooth horizontal scrolling */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between border-t border-emerald-800/80 overflow-x-auto scrollbar-none touch-pan-x">
        {/* Left Side: Public Tabs */}
        <div className="flex gap-1 py-1 min-w-max">
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-t-lg text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer relative whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-[#f7f9f7] text-emerald-950 shadow-sm border-t-2 border-amber-500'
                    : 'text-emerald-100/85 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                <span>{item.label}</span>

                {item.badge !== null && (
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      item.alertColor
                        ? 'bg-rose-500 text-white animate-pulse'
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

        {/* Right Side: MANAGEMENT TAB POSITIONED PROMINENTLY AT THE SIDE */}
        <div className="py-1 pl-2 sm:pl-3 min-w-max">
          <button
            id="tab-btn-management"
            onClick={() => handleTabClick('management')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer shadow-md border active:scale-95 ${
              isManagementActive
                ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-300/40'
                : isAdminUnlocked
                ? 'bg-emerald-800/90 hover:bg-emerald-750 text-amber-200 border-amber-500/50 hover:border-amber-400'
                : 'bg-emerald-950/90 hover:bg-emerald-900 text-amber-300 border-amber-500/40 hover:border-amber-400'
            }`}
            title={isAdminUnlocked ? 'Open Management Panel' : 'Authenticate to access Management Panel'}
          >
            <div className="flex items-center gap-1 sm:gap-1.5">
              <FileEdit className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isManagementActive ? 'text-emerald-950' : 'text-amber-300'}`} />
              <span className="hidden xs:inline sm:inline">Management</span>
              <span className="xs:hidden sm:hidden">Admin Panel</span>
            </div>

            {isAdminUnlocked ? (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-900/30 text-emerald-950">
                <ShieldCheck className="w-3 h-3 text-emerald-900" />
                <span className="hidden sm:inline">Admin</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-amber-950/50 text-amber-300 border border-amber-500/30">
                <Lock className="w-3 h-3 text-amber-300" />
                <span className="hidden sm:inline">Protected</span>
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
