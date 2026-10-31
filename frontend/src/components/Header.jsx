import React, { useState, useEffect } from 'react';
import { Bell, Wifi, ShieldAlert, Sparkles, User, RefreshCw, Download } from 'lucide-react';

export default function Header({ currentUser, alertsCount = 2, onTriggerRefresh }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-[#ebd7cc] px-6 flex items-center justify-between shrink-0 shadow-sm">
      {/* College Branding & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">
            Madhav Institute of Technology & Science, Gwalior
          </h2>
          <p className="text-[11px] text-[#8b1e3f] font-medium flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            NAAC Accredited A++ | Autonomous Institution | Centre for Internet of Things
          </p>
        </div>
      </div>

      {/* Right Controls: Live Telemetry Status, Clock, Alerts & User Avatar */}
      <div className="flex items-center gap-3.5">
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

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={currentUser?.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#ffd8be] shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-[10px] font-medium text-[#8b1e3f] capitalize">
              {currentUser?.role || 'Guest'} {currentUser?.enrollmentNo ? `(${currentUser.enrollmentNo})` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
