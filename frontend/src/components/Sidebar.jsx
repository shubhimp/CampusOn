import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Cpu, 
  Calendar, 
  Bell, 
  Compass, 
  QrCode, 
  LifeBuoy, 
  Settings,
  Activity,
  Layers
} from 'lucide-react';

export default function Sidebar({ currentRole, setCurrentRole, activeTab, setActiveTab }) {
  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'faculty', label: 'Faculty', icon: BookOpen },
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
    { id: 'parent', label: 'Parent Portal', icon: Users },
  ];

  const studentNav = [
    { id: 'overview', label: 'Daily Timetable', icon: Calendar },
    { id: 'digital_id', label: 'Digital Student ID', icon: QrCode },
    { id: 'rooms', label: 'Classroom Availability', icon: Layers },
    { id: 'navigation', label: 'Indoor Navigation', icon: Compass },
    { id: 'ai_mentor', label: 'AI Course Notes (RAG)', icon: BookOpen },
    { id: 'support', label: 'Welfare & Mentorship', icon: LifeBuoy },
  ];

  const facultyNav = [
    { id: 'schedule', label: 'My Teaching Schedule', icon: Calendar },
    { id: 'preferences', label: 'Timetable Preferences', icon: Settings },
    { id: 'notes', label: 'Course Notes Manager', icon: BookOpen },
    { id: 'cameras', label: 'Authorized Classroom Feeds', icon: ShieldCheck },
    { id: 'requests', label: 'Assigned Student Queries', icon: LifeBuoy },
  ];

  const adminNav = [
    { id: 'overview', label: 'Campus Control Tower', icon: Activity },
    { id: 'timetable_solver', label: 'AI Timetable Optimizer', icon: Calendar },
    { id: 'occupancy', label: 'Live IoT Room Matrix', icon: Layers },
    { id: 'safety', label: 'Safety & Hazard Alerts', icon: Bell },
    { id: 'analytics', label: 'Campus Analytics', icon: ShieldCheck },
  ];

  const parentNav = [
    { id: 'overview', label: 'Academic & Attendance', icon: Activity },
    { id: 'fees', label: 'Fee Ledger & Accounts', icon: BookOpen },
    { id: 'notices', label: 'College Notices', icon: Bell },
  ];

  const getNavItems = () => {
    switch (currentRole) {
      case 'faculty': return facultyNav;
      case 'admin': return adminNav;
      case 'parent': return parentNav;
      case 'student':
      default: return studentNav;
    }
  };

  return (
    <aside className="w-64 bg-[#fdf3ed] border-r border-[#edd5c6] flex flex-col h-screen select-none shrink-0 transition-all">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#ebd3c3] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b1e3f] to-[#b83252] flex items-center justify-center text-white shadow-md">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#8b1e3f]">CampusOn</h1>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">MITS Gwalior OS</p>
        </div>
      </div>

      {/* Role Switcher Pill */}
      <div className="p-3 border-b border-[#ebd3c3]/70 bg-[#faebe0]">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 block mb-1.5">
          Active Portal Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5 bg-[#f5dfd0] p-1 rounded-lg">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setCurrentRole(r.id);
                  setActiveTab(r.id === 'faculty' ? 'schedule' : 'overview');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#8b1e3f] text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:bg-[#edd5c6] hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
          {currentRole.toUpperCase()} SERVICES
        </p>
        {getNavItems().map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#8b1e3f] text-white shadow-sm font-semibold'
                  : 'text-slate-700 hover:bg-[#fae5d8] hover:text-[#8b1e3f]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8b1e3f]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Global IoT Simulator Shortcut */}
        <div className="pt-4 mt-3 border-t border-[#edd5c6]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            HARDWARE LAB
          </p>
          <button
            onClick={() => setActiveTab('iot_simulator')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'iot_simulator'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-amber-700" />
              <span>Virtual IoT ESP32</span>
            </div>
            <span className="text-[9px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
              LIVE
            </span>
          </button>
        </div>
      </nav>

      {/* Footer / Institution Info */}
      <div className="p-3.5 bg-[#f7e6db] border-t border-[#edd5c6] text-[11px] text-slate-600 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <div className="truncate">
          <p className="font-semibold text-slate-800 truncate">Centre for IoT</p>
          <p className="text-[10px] text-slate-500 truncate">Dept. of Electrical & Computer Engg.</p>
        </div>
      </div>
    </aside>
  );
}
