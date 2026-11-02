import React, { useState, useEffect } from 'react';
import { Bell, Wifi, ShieldAlert, Sparkles, User, RefreshCw, Download, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header({ currentUser, alertsCount = 2, onTriggerRefresh, onSignOut }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSubtext = () => {
    if (!currentUser) return 'Guest Session';
    if (currentUser.role === 'student') {
      return `Student • ${currentUser.enrollmentNo || 'BTEC25O1060'}`;
    }
    if (currentUser.role === 'faculty') {
      return `${currentUser.designation || 'Faculty'} • ${currentUser.employeeCode || 'FAC-ECE-208'}`;
    }
    if (currentUser.role === 'admin') {
      return `Administrator • ${currentUser.adminCode || 'Dean Office'}`;
    }
    if (currentUser.role === 'parent') {
      return `Parent / Guardian • ${currentUser.relationship || 'Father'}`;
    }
    return currentUser.role;
  };

  return (
    <header className="h-16 bg-white dark:bg-[#08080A] border-b border-[#E9E9E7] dark:border-[#222228] px-6 flex items-center justify-between shrink-0 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.8)] transition-colors">
      {/* College Branding & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Madhav Institute of Technology & Science, Gwalior
          </h2>
          <p className="text-[11px] text-[#CA8A04] dark:text-[#FFD000] font-semibold flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            NAAC Accredited A++ | Autonomous Institution | Centre for Internet of Things
          </p>
        </div>
      </div>

      {/* Right Controls: Live Telemetry Status, Clock, Alerts & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Pro Skilll Theme Switcher Pill (🌙 Dark / ☀️ Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to Full Light Theme" : "Switch to Full Dark Theme"}
          title={isDark ? "Switch to Full Light Theme" : "Switch to Full Dark Theme"}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-full border transition-all flex items-center justify-center gap-1.5 bg-white border-[#E9E9E7] text-[#191919] hover:border-[#FFD000] hover:bg-[#FEFDF0] dark:bg-[#121217] dark:border-[#27272A] dark:text-[#FFD000] dark:hover:border-[#FFD000] dark:hover:bg-[#181820] cursor-pointer shadow-xs"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#FFD000]" />
              <span className="text-[11px] font-mono font-bold text-white pr-0.5 hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#191919]" />
              <span className="text-[11px] font-mono font-bold text-[#191919] pr-0.5 hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Master PDF Download Button (Pro Skilll Yellow Action Pill) */}
        <a
          href="/CampusOn_Master_Guidebook.pdf"
          download="CampusOn_Master_Guidebook.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFD000] hover:bg-[#F0C400] text-black text-xs font-bold shadow-[0_0_16px_rgba(255,208,0,0.35)] hover:shadow-[0_0_24px_rgba(255,208,0,0.55)] border border-[#FFD000] transition-all cursor-pointer"
          title="Download Complete CampusOn Master & Viva Guidebook (PDF)"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Guidebook PDF</span>
        </a>

        {/* Node Telemetry Heartbeat */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#FEF9C3] dark:bg-[#121217] border border-[#FDE047] dark:border-[#27272A] text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-medium">
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-[#FFD000]" />
          <span>ESP32 Mesh: </span>
          <span className="font-mono text-emerald-700 dark:text-[#FFD000] font-bold">ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="text-right hidden lg:block">
          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Refresh simulation button */}
        {onTriggerRefresh && (
          <button
            onClick={onTriggerRefresh}
            title="Sync campus telemetry"
            className="p-2 rounded-xl text-slate-500 hover:text-[#CA8A04] dark:hover:text-[#FFD000] hover:bg-[#FEF9C3] dark:hover:bg-[#141419] border border-transparent transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Safety Alert Pill */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-slate-500 hover:text-[#CA8A04] dark:hover:text-[#FFD000] hover:bg-[#FEF9C3] dark:hover:bg-[#141419] border border-transparent transition-all cursor-pointer"
            title="Campus Safety Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD000] rounded-full ring-2 ring-white dark:ring-black animate-pulse" />
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-[#222228] mx-1" />

        {/* User Profile Pill & Sign Out */}
        <div className="flex items-center gap-2 pl-1">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#FFD000] shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight max-w-[140px] truncate">
              {currentUser?.name || 'Authorized User'}
            </p>
            <p className="text-[10px] font-semibold text-[#CA8A04] dark:text-[#FFD000] max-w-[150px] truncate">
              {getSubtext()}
            </p>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out / Switch Campus Account"
              className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
