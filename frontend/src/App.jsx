import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import IoTSimulator from './pages/IoTSimulator';
import AuthPage from './pages/AuthPage';
import { 
  USERS, 
  INITIAL_CLASSROOMS, 
  INITIAL_TIMETABLE, 
  SUBJECTS_ATTENDANCE 
} from './mockData';
import { fetchClassrooms } from './services/api';
import { getStoredSessionUser, logoutAccount } from './services/supabaseClient';

export default function App() {
  // Session User State (Loaded dynamically from Supabase / localStorage)
  const [currentUser, setCurrentUser] = useState(() => getStoredSessionUser());
  const [currentRole, setCurrentRole] = useState(() => currentUser?.role || 'student');
  const [activeTab, setActiveTab] = useState('overview');

  // Sync role if user changes
  useEffect(() => {
    if (currentUser?.role && currentUser.role !== currentRole) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // Shared Central State (Simulates unified database & real-time telemetry)
  const [classrooms, setClassrooms] = useState(INITIAL_CLASSROOMS);
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [subjects, setSubjects] = useState(SUBJECTS_ATTENDANCE);

  useEffect(() => {
    // Sync initial rooms from backend if available
    async function loadBackendData() {
      const data = await fetchClassrooms();
      if (data && data.length > 0) {
        setClassrooms(data);
      }
    }
    loadBackendData();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab(user.role === 'faculty' ? 'schedule' : 'overview');
  };

  const handleSignOut = async () => {
    await logoutAccount();
    setCurrentUser(null);
  };

  // If not authenticated, render the Dynamic Auth Page
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Real-time IoT telemetry synchronization handler
  const handleUpdateRoomTelemetry = (updatedTelemetry) => {
    setClassrooms((prev) =>
      prev.map((c) => (c.id === updatedTelemetry.id ? { ...c, ...updatedTelemetry } : c))
    );
  };

  const handleRequestAccess = (newReq) => {
    // Access request registered
    console.log('Room access requested:', newReq);
  };

  // Effective role: strictly locked to authenticated user's role for non-admins
  const effectiveRole = currentUser?.role === 'admin' ? currentRole : currentUser?.role || 'student';

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Light Peach Sidebar with Strict Role-Based Access Control */}
      <Sidebar
        currentUser={currentUser}
        currentRole={effectiveRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Header
          currentUser={currentUser}
          alertsCount={2}
          onSignOut={handleSignOut}
          onTriggerRefresh={() => {
            // Optional sync trigger
          }}
        />

        {/* Scrollable Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Virtual IoT Simulator View */}
            {activeTab === 'iot_simulator' && (
              <IoTSimulator
                classrooms={classrooms}
                onUpdateRoomTelemetry={handleUpdateRoomTelemetry}
              />
            )}

            {/* Student View (Strictly for Students) */}
            {activeTab !== 'iot_simulator' && effectiveRole === 'student' && (
              <StudentDashboard
                user={currentUser}
                timetable={timetable}
                classrooms={classrooms}
                subjects={subjects}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onRequestAccess={handleRequestAccess}
              />
            )}

            {/* Faculty / Professor View (Strictly for Faculty) */}
            {activeTab !== 'iot_simulator' && effectiveRole === 'faculty' && (
              <FacultyDashboard
                user={currentUser}
                timetable={timetable}
                classrooms={classrooms}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* Admin View (Strictly for Super Admins) */}
            {activeTab !== 'iot_simulator' && effectiveRole === 'admin' && (
              <AdminDashboard
                classrooms={classrooms}
                timetable={timetable}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* Parent View (Strictly for Parents) */}
            {activeTab !== 'iot_simulator' && effectiveRole === 'parent' && (
              <ParentDashboard
                user={currentUser}
                subjects={subjects}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
