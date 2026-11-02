import React from 'react';

export default function HexagonBadge({ icon: Icon, label, value, subtext, statusColor = 'yellow' }) {
  const colorMap = {
    yellow: {
      bg: 'bg-[#FEF9C3] dark:bg-[#121217]',
      border: 'border-[#FDE047] dark:border-[#222228]',
      text: 'text-[#713F12] dark:text-[#FFD000]',
      badge: 'bg-[#FFD000] text-black font-bold shadow-[0_0_12px_rgba(255,208,0,0.35)]',
      accent: '#FFD000'
    },
    maroon: {
      bg: 'bg-[#FEF9C3] dark:bg-[#121217]',
      border: 'border-[#FDE047] dark:border-[#222228]',
      text: 'text-[#713F12] dark:text-[#FFD000]',
      badge: 'bg-[#FFD000] text-black font-bold shadow-[0_0_12px_rgba(255,208,0,0.35)]',
      accent: '#FFD000'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-900',
      text: 'text-emerald-800 dark:text-emerald-400',
      badge: 'bg-emerald-600 text-white',
      accent: '#059669'
    },
    amber: {
      bg: 'bg-[#FEF9C3] dark:bg-amber-950/20',
      border: 'border-[#FDE047] dark:border-amber-900',
      text: 'text-[#713F12] dark:text-amber-300',
      badge: 'bg-[#FFD000] text-black font-bold',
      accent: '#FFD000'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-900',
      text: 'text-blue-800 dark:text-blue-400',
      badge: 'bg-blue-600 text-white',
      accent: '#2563eb'
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-[#121217]',
      border: 'border-slate-200 dark:border-[#222228]',
      text: 'text-slate-800 dark:text-slate-200',
      badge: 'bg-slate-700 text-white',
      accent: '#475569'
    }
  };

  const scheme = colorMap[statusColor] || colorMap.yellow;

  return (
    <div className={`hex-card p-4 flex items-center gap-4 ${scheme.bg} ${scheme.border} transition-all`}>
      {/* Hexagonal Icon Container */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div 
          className="w-12 h-12 flex items-center justify-center hex-badge shadow-sm transition-transform hover:rotate-6"
          style={{ backgroundColor: scheme.accent }}
        >
          {Icon && <Icon className="w-5 h-5 text-black" />}
        </div>
      </div>

      {/* Metric Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#A1A1AA] truncate">
          {label}
        </p>
        <p className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] font-medium text-slate-500 dark:text-[#A1A1AA] truncate mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
