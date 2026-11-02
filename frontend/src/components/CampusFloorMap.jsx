import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, CheckCircle, Info, ShieldAlert, Thermometer, Wind } from 'lucide-react';

export default function CampusFloorMap({ classrooms, onSelectRoom }) {
  const [selectedRoomId, setSelectedRoomId] = useState('AB-204');
  const [currentScanPoint, setCurrentScanPoint] = useState('West Entrance QR #02');

  const selectedRoom = classrooms.find((r) => r.id === selectedRoomId) || classrooms[0];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return { fill: '#d1fae5', stroke: '#10b981', badge: 'bg-emerald-100 text-emerald-800' };
      case 'Class in Session – Unavailable':
        return { fill: '#fee2e2', stroke: '#ef4444', badge: 'bg-rose-100 text-rose-800' };
      case 'Occupied – Open Use':
        return { fill: '#fef3c7', stroke: '#f59e0b', badge: 'bg-amber-100 text-amber-800' };
      case 'Status Unknown':
      default:
        return { fill: '#f1f5f9', stroke: '#94a3b8', badge: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#ebd7cc]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#CA8A04] dark:text-[#FFD000]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Indoor Campus Navigation & Floor Map</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A1A1AA] mt-0.5">
            Academic Block B — 2nd Floor (Department of Electrical & Computer Engineering)
          </p>
        </div>

        {/* QR Scan Starting Location Selector */}
        <div className="flex items-center gap-2 bg-[#FEF9C3] dark:bg-[#121217] px-3 py-1.5 rounded-xl border border-[#FDE047] dark:border-[#222228]">
          <MapPin className="w-4 h-4 text-[#CA8A04] dark:text-[#FFD000]" />
          <span className="text-xs text-slate-700 dark:text-[#A1A1AA] font-medium">Scanned Waypoint:</span>
          <select
            value={currentScanPoint}
            onChange={(e) => setCurrentScanPoint(e.target.value)}
            className="text-xs font-bold text-[#CA8A04] dark:text-[#FFD000] bg-transparent outline-none cursor-pointer"
          >
            <option value="West Entrance QR #02">West Staircase QR #02</option>
            <option value="Central Elevator QR #05">Central Elevator QR #05</option>
            <option value="East Corridor QR #08">East Corridor QR #08</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Interactive SVG Floor Map */}
        <div className="lg:col-span-2 bg-[#fbfbfb] p-4 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center">
          <svg viewBox="0 0 700 420" className="w-full h-auto max-h-[380px] drop-shadow-sm select-none">
            {/* Background Floor Outline */}
            <rect x="20" y="20" width="660" height="380" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

            {/* Central Corridor */}
            <rect x="40" y="180" width="620" height="60" fill="#f1f5f9" stroke="#e2e8f0" strokeDasharray="6 4" />
            <text x="350" y="215" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">
              MAIN ACADEMIC CORRIDOR (2ND FLOOR)
            </text>

            {/* West Entrance / Staircase */}
            <g transform="translate(30, 180)">
              <rect width="60" height="60" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              <text x="30" y="28" fill="#4338ca" fontSize="9" fontWeight="bold" textAnchor="middle">WAYPOINT</text>
              <text x="30" y="44" fill="#4338ca" fontSize="10" fontWeight="bold" textAnchor="middle">QR #02</text>
            </g>

            {/* East Elevator */}
            <g transform="translate(610, 180)">
              <rect width="60" height="60" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
              <text x="30" y="34" fill="#4338ca" fontSize="10" fontWeight="bold" textAnchor="middle">ELEVATOR</text>
            </g>

            {/* Room 1: AB-204 (IoT Lab) */}
            {(() => {
              const r = classrooms.find((c) => c.id === 'AB-204') || {};
              const colors = getStatusColor(r.status);
              const isSel = selectedRoomId === 'AB-204';
              return (
                <g 
                  onClick={() => setSelectedRoomId('AB-204')}
                  className="cursor-pointer transition-all hover:opacity-90"
                  transform="translate(110, 40)"
                >
                  <rect
                    width="170"
                    height="120"
                    rx="10"
                    fill={colors.fill}
                    stroke={isSel ? '#FFD000' : colors.stroke}
                    strokeWidth={isSel ? 4 : 2}
                  />
                  <text x="85" y="40" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">AB-204</text>
                  <text x="85" y="60" fill="#475569" fontSize="10" textAnchor="middle">IoT & Embedded Systems Lab</text>
                  <rect x="25" y="75" width="120" height="22" rx="11" fill="white" />
                  <text x="85" y="90" fill={colors.stroke} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {r.status || 'Active'}
                  </text>
                  {isSel && (
                    <circle cx="150" cy="20" r="6" fill="#FFD000" className="animate-ping" />
                  )}
                </g>
              );
            })()}

            {/* Room 2: AB-205 (Computer Networks Lab) */}
            {(() => {
              const r = classrooms.find((c) => c.id === 'AB-205') || {};
              const colors = getStatusColor(r.status);
              const isSel = selectedRoomId === 'AB-205';
              return (
                <g 
                  onClick={() => setSelectedRoomId('AB-205')}
                  className="cursor-pointer transition-all hover:opacity-90"
                  transform="translate(300, 40)"
                >
                  <rect
                    width="170"
                    height="120"
                    rx="10"
                    fill={colors.fill}
                    stroke={isSel ? '#FFD000' : colors.stroke}
                    strokeWidth={isSel ? 4 : 2}
                  />
                  <text x="85" y="40" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">AB-205</text>
                  <text x="85" y="60" fill="#475569" fontSize="10" textAnchor="middle">Networks & Simulation Lab</text>
                  <rect x="25" y="75" width="120" height="22" rx="11" fill="white" />
                  <text x="85" y="90" fill={colors.stroke} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {r.status || 'Available'}
                  </text>
                </g>
              );
            })()}

            {/* Room 3: Faculty Cabins AB-208 */}
            <g transform="translate(490, 40)">
              <rect width="160" height="120" rx="10" fill="#FEF9C3" stroke="#FDE047" strokeWidth="2" />
              <text x="80" y="45" fill="#713F12" fontSize="13" fontWeight="bold" textAnchor="middle">AB-208</text>
              <text x="80" y="65" fill="#854D0E" fontSize="10" textAnchor="middle">ECE Faculty Cabins</text>
              <text x="80" y="85" fill="#854D0E" fontSize="9" textAnchor="middle">(Dr. Murli Manohar)</text>
            </g>

            {/* Lower Row Rooms */}
            {/* Room 4: AB-101 (Connected via South Atrium) */}
            {(() => {
              const r = classrooms.find((c) => c.id === 'AB-101') || {};
              const colors = getStatusColor(r.status);
              const isSel = selectedRoomId === 'AB-101';
              return (
                <g 
                  onClick={() => setSelectedRoomId('AB-101')}
                  className="cursor-pointer transition-all hover:opacity-90"
                  transform="translate(110, 260)"
                >
                  <rect
                    width="220"
                    height="120"
                    rx="10"
                    fill={colors.fill}
                    stroke={isSel ? '#FFD000' : colors.stroke}
                    strokeWidth={isSel ? 4 : 2}
                  />
                  <text x="110" y="40" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">AB-101</text>
                  <text x="110" y="60" fill="#475569" fontSize="10" textAnchor="middle">Smart Lecture Hall 1 (Capacity: 65)</text>
                  <rect x="40" y="75" width="140" height="22" rx="11" fill="white" />
                  <text x="110" y="90" fill={colors.stroke} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {r.status || 'In Session'}
                  </text>
                </g>
              );
            })()}

            {/* Room 5: AB-102 (ECE Seminar Hall) */}
            {(() => {
              const r = classrooms.find((c) => c.id === 'AB-102') || {};
              const colors = getStatusColor(r.status);
              const isSel = selectedRoomId === 'AB-102';
              return (
                <g 
                  onClick={() => setSelectedRoomId('AB-102')}
                  className="cursor-pointer transition-all hover:opacity-90"
                  transform="translate(350, 260)"
                >
                  <rect
                    width="240"
                    height="120"
                    rx="10"
                    fill={colors.fill}
                    stroke={isSel ? '#FFD000' : colors.stroke}
                    strokeWidth={isSel ? 4 : 2}
                  />
                  <text x="120" y="40" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">AB-102</text>
                  <text x="120" y="60" fill="#475569" fontSize="10" textAnchor="middle">ECE Seminar & Auditorium (120)</text>
                  <rect x="50" y="75" width="140" height="22" rx="11" fill="white" />
                  <text x="120" y="90" fill={colors.stroke} fontSize="9" fontWeight="bold" textAnchor="middle">
                    {r.status || 'Available'}
                  </text>
                </g>
              );
            })()}

            {/* Navigation Path Animation from QR Waypoint to Selected Room */}
            {selectedRoomId === 'AB-204' && (
              <g>
                <path
                  d="M 90 210 L 195 210 L 195 165"
                  fill="none"
                  stroke="#FFD000"
                  strokeWidth="4"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx="195" cy="165" r="5" fill="#FFD000" />
              </g>
            )}
          </svg>

          {/* Map Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" /> Class in Session
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Occupied (Open Use)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" /> Status Unknown
            </span>
          </div>
        </div>

        {/* Selected Room Telemetry & Navigation Panel */}
        <div className="bg-[#FEFDF8] dark:bg-[#121217] p-5 rounded-xl border border-[#FEF08A] dark:border-[#222228] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-black bg-[#FFD000] px-2 py-0.5 rounded shadow-xs">
                {selectedRoom.id}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(selectedRoom.status).badge}`}>
                {selectedRoom.status}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{selectedRoom.name}</h4>
            <p className="text-xs text-slate-500 dark:text-[#A1A1AA]">{selectedRoom.building} • {selectedRoom.floor}</p>
            <p className="text-xs text-slate-600 dark:text-[#A1A1AA] font-medium mt-1">Seating Capacity: {selectedRoom.capacity} Students</p>

            {/* Real-time ESP32 Sensor Readings */}
            <div className="mt-4 pt-4 border-t border-[#FEF08A] dark:border-[#222228] space-y-2.5 text-xs">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#71717A]">
                Live Sensor Telemetry
              </p>

              <div className="flex items-center justify-between bg-white dark:bg-[#0D0D11] p-2.5 rounded-lg border border-[#FEF08A] dark:border-[#222228]">
                <span className="flex items-center gap-2 text-slate-600 dark:text-[#A1A1AA]">
                  <Thermometer className="w-4 h-4 text-rose-500" /> Temperature:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedRoom.temperature ? `${selectedRoom.temperature}°C` : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-[#0D0D11] p-2.5 rounded-lg border border-[#FEF08A] dark:border-[#222228]">
                <span className="flex items-center gap-2 text-slate-600 dark:text-[#A1A1AA]">
                  <Wind className="w-4 h-4 text-blue-500" /> Humidity:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {selectedRoom.humidity ? `${selectedRoom.humidity}%` : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-[#0D0D11] p-2.5 rounded-lg border border-[#FEF08A] dark:border-[#222228]">
                <span className="flex items-center gap-2 text-slate-600 dark:text-[#A1A1AA]">
                  <Activity className="w-4 h-4 text-emerald-500" /> PIR Motion:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedRoom.pirDetected ? 'Motion Active' : 'No Movement'}
                </span>
              </div>
            </div>

            {/* Navigation directions */}
            <div className="mt-4 bg-white dark:bg-[#0D0D11] p-3 rounded-lg border border-[#FEF08A] dark:border-[#222228] text-xs">
              <p className="font-bold text-[#CA8A04] dark:text-[#FFD000] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#CA8A04] dark:text-[#FFD000]" /> Turn-by-Turn Route:
              </p>
              <p className="text-slate-600 dark:text-[#A1A1AA] text-[11px] mt-1 leading-relaxed">
                From <b>{currentScanPoint}</b>, walk 15 meters along the central corridor, then turn left into Door 204.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectRoom && onSelectRoom(selectedRoom)}
            className="w-full mt-4 bg-[#FFD000] hover:bg-[#F0C400] text-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,208,0,0.35)] cursor-pointer"
          >
            Request Access or View Details
          </button>
        </div>
      </div>
    </div>
  );
}
