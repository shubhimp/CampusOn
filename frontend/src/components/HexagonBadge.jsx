import React from 'react';

export default function HexagonBadge({ icon: Icon, label, value, subtext, statusColor = 'maroon' }) {
  const colorMap = {
    maroon: {
      bg: 'bg-maroon-50',
      border: 'border-maroon-200',
      text: 'text-maroon-800',
      badge: 'bg-maroon-700 text-white',
      accent: '#8b1e3f'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badge: 'bg-emerald-600 text-white',
      accent: '#059669'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      badge: 'bg-amber-600 text-white',
      accent: '#d97706'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      badge: 'bg-blue-600 text-white',
      accent: '#2563eb'
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-800',
      badge: 'bg-slate-600 text-white',
      accent: '#475569'
    }
  };

  const scheme = colorMap[statusColor] || colorMap.maroon;

  return (
    <div className={`hex-card p-4 flex items-center gap-4 ${scheme.bg} ${scheme.border}`}>
      {/* Hexagonal Icon Container */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div 
          className="w-12 h-12 flex items-center justify-center hex-badge shadow-sm transition-transform hover:rotate-6"
          style={{ backgroundColor: scheme.accent }}
        >
          {Icon && <Icon className="w-5 h-5 text-white" />}
        </div>
      </div>

      {/* Metric Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </p>
        <p className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
