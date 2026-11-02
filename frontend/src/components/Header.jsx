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
    <header className="h-16 bg-white dark:bg-[#0f172a] border-b border-[#ebd7cc] dark:border-slate-800 px-6 flex items-center justify-between shrink-0 shadow-sm">
      {/* College Branding & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Madhav Institute of Technology & Science, Gwalior
          </h2>
          <p className="text-[11px] text-[#8b1e3f] dark:text-rose-400 font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            NAAC Accredited A++ | Autonomous Institution | Centre for Internet of Things
          </p>
        </div>
      </div>

      {/* Right Controls: Live Telemetry Status, Clock, Alerts & User Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Theme Switcher Toggle (🌙 Dark / ☀️ Light) */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isDark 
              ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-amber-400/50' 
              : 'bg-[#fdf3ed] border-[#edd5c6] text-[#8b1e3f] hover:bg-[#fae5d8]'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme (or use ?theme=${isDark ? 'light' : 'dark'})`}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>☀️ Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#8b1e3f]" />
              <span>🌙 Dark</span>
            </>
          )}
        </button>

        {/* Master PDF Download Button */}
        <a
          href="/CampusOn_Master_Guidebook.pdf"
          download="CampusOn_Master_Guidebook.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8b1e3f] hover:bg-[#721832] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          title="Download Complete CampusOn Master & Viva Guidebook (PDF)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Guidebook PDF</span>
        </a>

        {/* Node Telemetry Heartbeat */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#fdf3ed] border border-[#edd5c6] text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span>ESP32 Mesh: </span>
          <span className="font-mono text-emerald-700 font-bold">ONLINE</span>
        </div>

        {/* Live Clock */}
        <div className="text-right hidden lg:block">
          <div className="text-xs font-mono font-semibold text-slate-700">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Refresh simulation button */}
        {onTriggerRefresh && (
          <button
            onClick={onTriggerRefresh}
            title="Sync campus telemetry"
            className="p-2 rounded-xl text-slate-500 hover:text-[#8b1e3f] hover:bg-[#fdf3ed] border border-transparent hover:border-[#edd5c6] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {/* Safety Alert Pill */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
            title="Campus Safety Alerts"
          >
            <Bell className="w-4 h-4" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Pill & Sign Out */}
        <div className="flex items-center gap-2 pl-1">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#ffd8be] shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight max-w-[140px] truncate">
              {currentUser?.name || 'Authorized User'}
            </p>
            <p className="text-[10px] font-medium text-[#8b1e3f] max-w-[150px] truncate">
              {getSubtext()}
            </p>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out / Switch Campus Account"
              className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
