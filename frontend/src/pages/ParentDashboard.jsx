import React from 'react';
import { 
  Users, 
  CheckCircle, 
  BookOpen, 
  Bell, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  GraduationCap, 
  FileText 
} from 'lucide-react';
import HexagonBadge from '../components/HexagonBadge';

export default function ParentDashboard({ user, subjects }) {
  const announcements = [
    {
      id: 'ann-01',
      title: 'Mid-Semester Examination Schedule Announced',
      date: '28 Oct 2026',
      department: 'Office of the Controller of Examinations',
      summary: 'Mid-term evaluations commence from 15th November 2026. Hall tickets available on student portal.'
    },
    {
      id: 'ann-02',
      title: 'Annual TechFest & IoT Hardware Exhibition',
      date: '22 Oct 2026',
      department: 'Centre for Internet of Things',
      summary: 'Parents are cordially invited to witness student smart campus prototypes at the Central Auditorium.'
    }
  ];

  const feeHistory = [
    { sem: '3rd Semester (Academic Year 2026-27)', amount: '₹ 54,000', status: 'Paid', receipt: 'REC-2026-8921', date: '05 Aug 2026' },
    { sem: '2nd Semester (Academic Year 2025-26)', amount: '₹ 52,000', status: 'Paid', receipt: 'REC-2025-4102', date: '10 Jan 2026' },
    { sem: '1st Semester (Academic Year 2025-26)', amount: '₹ 52,000', status: 'Paid', receipt: 'REC-2025-1089', date: '20 Jul 2025' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Linked Student Details */}
      <div className="bg-gradient-to-r from-white via-[#fff7f2] to-[#faebe0] p-6 rounded-2xl border border-[#ebd7cc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            alt="Shubhi Mathur"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#8b1e3f] shadow-md"
          />
          <div>
            <span className="text-[10px] font-bold text-[#8b1e3f] uppercase tracking-wider bg-[#ffd8be] px-2 py-0.5 rounded">
              Linked Student Profile
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">Shubhi Mathur</h3>
            <p className="text-xs text-slate-600 font-mono">
              Enrolment: BTEC25O1060 • B.Tech Electrical & Computer Engineering (3rd Sem)
            </p>
          </div>
        </div>

        {/* Confidentiality Privacy Assurance Pill */}
        <div className="bg-white p-3 rounded-xl border border-purple-200 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-800">Student Privacy Shield Active</p>
            <p className="text-[10px] text-slate-500">
              Personal counseling conversations & sensitive grievance files are protected by institutional policy.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HexagonBadge
          icon={CheckCircle}
          label="Cumulative Attendance"
          value="88.3%"
          subtext="Good Standing (≥ 75% required)"
          statusColor="emerald"
        />
        <HexagonBadge
          icon={GraduationCap}
          label="Previous SGPA"
          value="8.74 / 10"
          subtext="Class Rank: Top 5%"
          statusColor="maroon"
        />
        <HexagonBadge
          icon={CreditCard}
          label="Tuition Fees Due"
          value="₹ 0.00"
          subtext="All Dues Cleared for 3rd Sem"
          statusColor="blue"
        />
        <HexagonBadge
          icon={Bell}
          label="Official Notices"
          value="2 Unread"
          subtext="Exam Circular Published"
          statusColor="amber"
        />
      </div>

      {/* Attendance & Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Subject-wise Academic Attendance Records
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Verified by RFID classroom check-in and dynamic QR reader terminals.
          </p>

          <div className="space-y-4">
            {subjects.map((sub) => (
              <div key={sub.code} className="p-3.5 rounded-xl border border-[#ebd7cc] bg-[#fffaf7]">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#8b1e3f] bg-[#ffd8be] px-1.5 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800 ml-2">{sub.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#8b1e3f]">{sub.percentage}%</span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 my-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${sub.percentage}%`,
                      backgroundColor: sub.percentage >= 85 ? '#10b981' : sub.percentage >= 75 ? '#f97316' : '#ef4444'
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Attended {sub.attended} out of {sub.total} conducted sessions</span>
                  <span className="font-medium text-slate-700">Faculty: {sub.faculty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official College Notices */}
        <div className="bg-white rounded-2xl border border-[#ebd7cc] shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#8b1e3f]" />
              Official Announcements
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Verified notices issued by the Dean's office
            </p>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3 rounded-xl border border-[#ebd7cc] bg-[#fffaf7] text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{ann.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1">{ann.summary}</p>
                  <p className="text-[10px] text-[#8b1e3f] font-semibold mt-2">{ann.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Payment Confirmation */}
          <div className="mt-5 pt-4 border-t border-[#ebd7cc]">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Latest Fee Transaction
            </h4>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <div className="flex justify-between font-bold text-emerald-900">
                <span>3rd Sem Tuition Fee</span>
                <span>₹ 54,000 (PAID)</span>
              </div>
              <p className="text-[10px] text-emerald-700 mt-1">Receipt No: REC-2026-8921</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
