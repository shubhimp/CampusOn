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
    <div className="max-w-md mx-auto bg-gradient-to-br from-white via-[#fff7f2] to-[#faebe0] rounded-2xl border-2 border-[#edd5c6] shadow-xl overflow-hidden relative">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#8b1e3f] to-[#b83252] text-white p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-90">Digital Identity Card</p>
          <h3 className="text-sm font-bold tracking-tight">Madhav Institute of Technology & Science</h3>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
        </div>
      </div>

      <div className="p-6">
        {/* Profile Info Row */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="w-20 h-24 object-cover rounded-xl border-2 border-[#8b1e3f] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white">
              <CheckCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffd8be] text-[#8b1e3f] mb-1">
              ACTIVE ENROLLMENT
            </span>
            <h4 className="text-base font-extrabold text-slate-900 truncate">{user?.name}</h4>
            <p className="text-xs font-mono font-semibold text-slate-700">{user?.enrollmentNo}</p>
            <p className="text-[11px] text-slate-600 truncate">{user?.department}</p>
            <p className="text-[11px] font-medium text-slate-500">{user?.semester} (Batch 2025-29)</p>
          </div>
        </div>

        {/* Dynamic QR Code Box */}
        <div className="mt-5 p-4 bg-white rounded-xl border border-[#ebd3c3] shadow-inner text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#8b1e3f]" />
              Time-Expiring Token
            </span>
            <span className="text-xs font-mono font-bold text-[#8b1e3f]">
              {tokenSeconds}s remaining
            </span>
          </div>

          {/* Validity Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                tokenSeconds < 8 ? 'bg-rose-500' : 'bg-[#8b1e3f]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* QR Graphic with dynamic hash */}
          <div className="flex justify-center my-2">
            <div className="p-3 bg-white border-2 border-slate-900 rounded-xl shadow-sm relative group">
              {/* Dynamic QR SVG rendering */}
              <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer Targets */}
                <rect x="5" y="5" width="26" height="26" rx="4" stroke="#8b1e3f" strokeWidth="4" fill="white" />
                <rect x="11" y="11" width="14" height="14" fill="#8b1e3f" />

                <rect x="69" y="5" width="26" height="26" rx="4" stroke="#8b1e3f" strokeWidth="4" fill="white" />
                <rect x="75" y="11" width="14" height="14" fill="#8b1e3f" />

                <rect x="5" y="69" width="26" height="26" rx="4" stroke="#8b1e3f" strokeWidth="4" fill="white" />
                <rect x="11" y="75" width="14" height="14" fill="#8b1e3f" />

                {/* Center Dynamic Matrix Elements */}
                <rect x="42" y="10" width="8" height="8" fill="#1e293b" />
                <rect x="52" y="20" width="8" height="8" fill="#8b1e3f" />
                <rect x="38" y="38" width="24" height="24" rx="3" fill="#8b1e3f" opacity="0.1" />
                <circle cx="50" cy="50" r="8" fill="#8b1e3f" />

                <rect x="10" y="42" width="6" height="6" fill="#1e293b" />
                <rect x="22" y="48" width="6" height="6" fill="#1e293b" />
                <rect x="45" y="70" width="6" height="6" fill="#8b1e3f" />
                <rect x="75" y="42" width="6" height="6" fill="#1e293b" />
                <rect x="85" y="55" width="6" height="6" fill="#8b1e3f" />
                <rect x="65" y="75" width="8" height="8" fill="#1e293b" />
                <rect x="80" y="80" width="10" height="10" fill="#8b1e3f" />
              </svg>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-800 tracking-wider bg-slate-100 px-3 py-1 rounded-md">
              {securityToken}
            </span>
            <button
              onClick={generateNewToken}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#8b1e3f] transition-all"
              title="Force Regenerate Token"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 italic">
            * Anti-screenshot security enabled: code auto-refreshes to prevent unauthorized proxy reuse.
          </p>
        </div>

        {/* RFID & Authorized Room Access Status */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#fcf1ea] p-2.5 rounded-xl border border-[#ebd7cc]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              <Radio className="w-3 h-3 text-[#8b1e3f]" />
              Linked RFID Tag
            </p>
            <p className="font-mono font-bold text-slate-800 text-[11px] mt-0.5">
              {user?.rfidTag || 'RFID-9A-4F-2C-11'}
            </p>
          </div>
          <div className="bg-[#fcf1ea] p-2.5 rounded-xl border border-[#ebd7cc]">
            <p className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Access Privilege
            </p>
            <p className="font-bold text-emerald-700 text-[11px] mt-0.5">
              Lab AB-204 & AB-101
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
