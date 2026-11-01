import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Cpu, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Hash, 
  Building, 
  Radio, 
  KeyRound, 
  Phone, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { registerAccount, loginAccount } from '../services/supabaseClient';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    // Student
    enrollmentNo: '',
    department: 'Electrical & Computer Engineering',
    semester: '3rd Semester',
    rfidTag: 'RFID-9A-4F-2C-11',
    // Faculty / Professor
    employeeCode: '',
    designation: 'Associate Professor & IoT Mentor',
    cabin: 'Faculty Block B - Cabin 208',
    // Administrator
    adminCode: '',
    adminDivision: 'Central Administration & Campus Infra',
    adminPasscode: 'CAMPUS-MITS-2026',
    // Parent
    linkedStudent: 'Shubhi Mathur (BTEC25O1060)',
    relationship: 'Father',
    emergencyContact: '+91 98260 12345'
  });

  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
      tagline: 'Access Digital ID, Timetable & Notes',
      defaultEmail: 'shubhi.btec25o1060@mitsgwalior.in'
    },
    {
      id: 'faculty',
      label: 'Faculty / Professor',
      icon: BookOpen,
      tagline: 'Manage Teaching Schedule & Labs',
      defaultEmail: 'murli.manohar@mitsgwalior.in'
    },
    {
      id: 'admin',
      label: 'Administrator',
      icon: ShieldCheck,
      tagline: 'Campus Controls, OR-Tools & Security',
      defaultEmail: 'dean.infra@mitsgwalior.in'
    },
    {
      id: 'parent',
      label: 'Parent Portal',
      icon: Users,
      tagline: 'Attendance, Ledgers & Ward Progress',
      defaultEmail: 'rkmathur.gwalior@gmail.com'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setErrorMsg('');
    setSuccessMsg('');
    // Auto-fill a representative email when switching in Sign In mode
    const r = roles.find(item => item.id === roleId);
    if (r && mode === 'signin' && !formData.email) {
      setFormData(prev => ({ ...prev, email: r.defaultEmail }));
    }
  };

  // Quick 1-Click Examiner / Demo Login
  const handleQuickDemoLogin = async (roleId) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const demoAccounts = {
        student: { email: 'shubhi.btec25o1060@mitsgwalior.in', pass: 'MITS@2026' },
        faculty: { email: 'murli.manohar@mitsgwalior.in', pass: 'MITS@2026' },
        admin: { email: 'dean.infra@mitsgwalior.in', pass: 'MITS@2026' },
        parent: { email: 'rkmathur.gwalior@gmail.com', pass: 'MITS@2026' }
      };
      const creds = demoAccounts[roleId];
      const res = await loginAccount(creds.email, creds.pass, roleId);
      if (res.success) {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.fullName || !formData.email || !formData.password) {
          throw new Error('Please fill in your Full Name, Email, and Password.');
        }

        const res = await registerAccount({
          ...formData,
          role: selectedRole
        });

        if (res.success) {
          setSuccessMsg('Account registered successfully with Supabase! Logging you into your campus portal...');
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 900);
        }
      } else {
        // Sign In
        if (!formData.email || !formData.password) {
          throw new Error('Please enter your Institute Email and Password.');
        }

        const res = await loginAccount(formData.email, formData.password, selectedRole);
        if (res.success) {
          setSuccessMsg('Authentication verified! Welcome back.');
          setTimeout(() => {
            onLoginSuccess(res.user);
          }, 500);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f4] via-[#f7e6db] to-[#f4dcd0] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Campus Branding */}
      <div className="max-w-4xl mx-auto w-full text-center mb-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 border border-[#edd5c6] shadow-xs mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-[#8b1e3f] uppercase tracking-wider">
            Madhav Institute of Technology & Science, Gwalior
          </span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8b1e3f] text-white flex items-center justify-center shadow-md">
            <Cpu className="w-7 h-7" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#8b1e3f] tracking-tight">
              CampusOn OS
            </h1>
            <p className="text-xs font-semibold text-slate-600">
              Department of Electrical & Computer Engg. | Centre for Internet of Things
            </p>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-[#ebd7cc] overflow-hidden">
        {/* Mode Selector Tabs (Sign In vs Create Account) */}
        <div className="grid grid-cols-2 border-b border-[#ebd7cc] bg-[#fbf3ee]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-4 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'signin'
                ? 'bg-white text-[#8b1e3f] border-b-2 border-[#8b1e3f] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-4 text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              mode === 'signup'
                ? 'bg-white text-[#8b1e3f] border-b-2 border-[#8b1e3f] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Create New Account</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Role Selection Grid */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Your Campus Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#8b1e3f] bg-[#fdf3ed] ring-2 ring-[#8b1e3f]/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#8b1e3f] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8b1e3f]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isSelected ? 'text-[#8b1e3f]' : 'text-slate-800'}`}>
                        {r.label}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {r.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={
                      selectedRole === 'student' ? 'e.g. Shubhi Mathur' :
                      selectedRole === 'faculty' ? 'e.g. Dr. Murli Manohar' :
                      selectedRole === 'admin' ? 'e.g. Prof. R. C. Gupta' : 'e.g. Mr. R. K. Mathur'
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email & Password (Both Modes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institute / Personal Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@mitsgwalior.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b1e3f] focus:ring-2 focus:ring-[#8b1e3f]/20 outline-none text-xs text-slate-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- Dynamic Role Specific Fields for Account Creation --- */}
            {mode === 'signup' && selectedRole === 'student' && (
              <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student Academic Credentials</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Enrollment Number
                    </label>
                    <div className="relative">
                      <Hash className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        name="enrollmentNo"
                        value={formData.enrollmentNo}
                        onChange={handleInputChange}
                        placeholder="e.g. BTEC25O1060"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Current Semester
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                    >
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester (Current)</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                    >
                      <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="AI & Data Science">AI & Data Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      RFID Tag UID (Lab Gate Access)
                    </label>
                    <div className="relative">
                      <Radio className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        name="rfidTag"
                        value={formData.rfidTag}
                        onChange={handleInputChange}
                        placeholder="RFID-9A-4F-2C-11"
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && selectedRole === 'faculty' && (
              <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Faculty & Professor Profile</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Employee Code / Faculty ID
                    </label>
                    <input
                      type="text"
                      name="employeeCode"
                      value={formData.employeeCode}
                      onChange={handleInputChange}
                      placeholder="e.g. FAC-ECE-208"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Designation
                    </label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                    >
                      <option value="Associate Professor & IoT Mentor">Associate Professor & IoT Mentor</option>
                      <option value="Professor & Head of Department">Professor & Head of Department</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Laboratory Coordinator">Laboratory Coordinator</option>
                      <option value="Adjunct Professor">Adjunct Professor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Cabin Location
                    </label>
                    <input
                      type="text"
                      name="cabin"
                      value={formData.cabin}
                      onChange={handleInputChange}
                      placeholder="e.g. Faculty Block B - Cabin 208"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && selectedRole === 'admin' && (
              <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Campus Administrator Authorization</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Admin Staff ID
                    </label>
                    <input
                      type="text"
                      name="adminCode"
                      value={formData.adminCode}
                      onChange={handleInputChange}
                      placeholder="e.g. ADM-MITS-01"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Administrative Division
                    </label>
                    <input
                      type="text"
                      name="adminDivision"
                      value={formData.adminDivision}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && selectedRole === 'parent' && (
              <div className="p-4 bg-[#fdf8f5] rounded-2xl border border-[#edd7ca] space-y-3">
                <p className="text-[11px] font-bold text-[#8b1e3f] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Parent & Ward Information</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Linked Student
                    </label>
                    <input
                      type="text"
                      name="linkedStudent"
                      value={formData.linkedStudent}
                      onChange={handleInputChange}
                      placeholder="e.g. Shubhi Mathur (BTEC25O1060)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Relationship
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none bg-white"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Local Guardian">Local Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="+91 98260 12345"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#8b1e3f] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#8b1e3f] hover:bg-[#721832] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Complete Registration & Enter Portal' : 'Authorize & Launch Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Evaluation / Viva Test Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                One-Click Viva & Faculty Demo Logins
              </span>
              <span className="text-[10px] text-slate-400">Pre-seeded accounts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('student')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Student</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Shubhi Mathur</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('faculty')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Faculty</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Dr. M. Manohar</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Admin</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">Dean Infra</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('parent')}
                disabled={loading}
                className="px-2.5 py-2 rounded-xl bg-slate-50 hover:bg-[#fdf3ed] border border-slate-200 hover:border-[#8b1e3f] text-left transition-all text-xs"
              >
                <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#8b1e3f]" />
                  <span>Parent</span>
                </p>
                <p className="text-[10px] text-slate-500 truncate">R. K. Mathur</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="max-w-4xl mx-auto w-full text-center mt-6 text-[11px] text-slate-500">
        <p>
          Integrated with <span className="font-semibold text-slate-700">Supabase Cloud Auth & PostgreSQL Database</span> | Google OR-Tools CP-SAT Timetable Engine
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          Developed by Shubhi Mathur (BTEC25O1060) & Tamanna Sharma (BTEC25O1063) | Mentor: Dr. Murli Manohar
        </p>
      </div>
    </div>
  );
}
