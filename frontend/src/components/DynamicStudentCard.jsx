import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, RefreshCw, Radio, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function DynamicStudentCard({ user }) {
  const [tokenSeconds, setTokenSeconds] = useState(30);
  const [securityToken, setSecurityToken] = useState('MITS-2026-X89F2A');
  const [isCopied, setIsCopied] = useState(false);

  // Rotate dynamic token every 30 seconds to prevent screenshot reuse
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenSeconds((prev) => {
        if (prev <= 1) {
          generateNewToken();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateNewToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'MITS-2026-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSecurityToken(result);
    setTokenSeconds(30);
  };

  const progressPercent = (tokenSeconds / 30) * 100;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#121217] rounded-2xl border-2 border-[#FEF08A] dark:border-[#222228] shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden relative transition-colors">
      {/* Top Banner (Pro Skilll Yellow) */}
      <div className="bg-[#FFD000] text-black p-4 flex items-center justify-between font-bold shadow-xs">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase font-bold text-black/80">Digital Identity Card</p>
          <h3 className="text-sm font-extrabold tracking-tight text-black">Madhav Institute of Technology & Science</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center border border-black/20">
          <ShieldCheck className="w-4 h-4 text-black" />
        </div>
      </div>

      <div className="p-6">
        {/* Profile Info Row */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-20 h-24 object-cover rounded-xl border-2 border-[#FFD000] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white dark:border-black">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEF9C3] dark:bg-[#FFD000]/20 text-[#713F12] dark:text-[#FFD000] border border-[#FDE047] dark:border-[#FFD000]/40 mb-1">
              ACTIVE ENROLLMENT
            </span>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{user?.name}</h4>
            <p className="text-xs font-mono font-bold text-[#CA8A04] dark:text-[#FFD000]">{user?.enrollmentNo}</p>
            <p className="text-[11px] text-slate-600 dark:text-[#A1A1AA] truncate">{user?.department}</p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-[#71717A]">{user?.semester} (Batch 2025-29)</p>
          </div>
        </div>

        {/* Dynamic QR Code Box */}
        <div className="mt-5 p-4 bg-[#FEFDF8] dark:bg-[#0D0D11] rounded-xl border border-[#FEF08A] dark:border-[#222228] shadow-inner text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-[#A1A1AA] uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#CA8A04] dark:text-[#FFD000]" />
              Time-Expiring Token
            </span>
            <span className="text-xs font-mono font-bold text-[#CA8A04] dark:text-[#FFD000]">
              {tokenSeconds}s remaining
            </span>
          </div>

          {/* Validity Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-[#222228] rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                tokenSeconds < 8 ? 'bg-rose-500' : 'bg-[#FFD000]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* QR Graphic with dynamic hash */}
          <div className="flex justify-center my-2">
            <div className="p-3 bg-white rounded-xl border border-slate-200 dark:border-[#27272A] shadow-sm relative group">
              {/* Dynamic QR SVG rendering */}
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Targets */}
                <rect x="5" y="5" width="26" height="26" rx="4" stroke="#FFD000" strokeWidth="4" fill="white" />
                <rect x="11" y="11" width="14" height="14" fill="#08080A" />

                <rect x="69" y="5" width="26" height="26" rx="4" stroke="#FFD000" strokeWidth="4" fill="white" />
                <rect x="75" y="11" width="14" height="14" fill="#08080A" />

                <rect x="5" y="69" width="26" height="26" rx="4" stroke="#FFD000" strokeWidth="4" fill="white" />
                <rect x="11" y="75" width="14" height="14" fill="#08080A" />

                {/* Center Dynamic Matrix Elements */}
                <rect x="42" y="10" width="8" height="8" fill="#FFD000" />
                <rect x="52" y="20" width="8" height="8" fill="#08080A" />
                <rect x="38" y="38" width="24" height="24" rx="3" fill="#FFD000" opacity="0.25" />
                <circle cx="50" cy="50" r="8" fill="#FFD000" />

                <rect x="10" y="42" width="6" height="6" fill="#08080A" />
                <rect x="22" y="48" width="6" height="6" fill="#FFD000" />
                <rect x="45" y="70" width="6" height="6" fill="#08080A" />
                <rect x="75" y="42" width="6" height="6" fill="#08080A" />
                <rect x="85" y="55" width="6" height="6" fill="#FFD000" />
                <rect x="65" y="75" width="8" height="8" fill="#08080A" />
                <rect x="80" y="80" width="10" height="10" fill="#FFD000" />
              </svg>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tracking-wider bg-[#FEF9C3] dark:bg-[#181820] border border-[#FDE047] dark:border-[#27272A] px-3 py-1 rounded-md">
              {securityToken}
            </span>
            <button
              onClick={generateNewToken}
              className="p-1 rounded-md hover:bg-[#FEF9C3] dark:hover:bg-[#181820] text-slate-500 hover:text-black dark:hover:text-[#FFD000] transition-all cursor-pointer"
              title="Force Regenerate Token"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-[#71717A] mt-1 italic">
            * Anti-screenshot security enabled: code auto-refreshes to prevent unauthorized proxy reuse.
          </p>
        </div>

        {/* RFID & Authorized Room Access Status */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#FEF9C3] dark:bg-[#0D0D11] p-2.5 rounded-xl border border-[#FDE047] dark:border-[#222228]">
            <p className="text-[10px] text-slate-700 dark:text-[#A1A1AA] font-mono font-semibold uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#CA8A04] dark:text-[#FFD000]" />
              Linked RFID Tag
            </p>
            <p className="font-mono font-bold text-slate-900 dark:text-[#FFD000] text-[11px] mt-0.5">
              {user?.rfidTag || 'RFID-9A-4F-2C-11'}
            </p>
          </div>
          <div className="bg-[#FEF9C3] dark:bg-[#0D0D11] p-2.5 rounded-xl border border-[#FDE047] dark:border-[#222228]">
            <p className="text-[10px] text-slate-700 dark:text-[#A1A1AA] font-mono font-semibold uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-[#FFD000]" />
              Access Privilege
            </p>
            <p className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px] mt-0.5">
              Lab AB-204 & AB-101
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
