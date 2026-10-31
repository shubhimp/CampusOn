import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import IoTSimulator from './pages/IoTSimulator';
import { 
  USERS, 
  INITIAL_CLASSROOMS, 
  INITIAL_TIMETABLE, 
  SUBJECTS_ATTENDANCE 
} from './mockData';
import { fetchClassrooms } from './services/api';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student');
  const [activeTab, setActiveTab] = useState('overview');

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

  const currentUser = USERS[currentRole] || USERS.student;

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

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Light Peach Sidebar */}
      <Sidebar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <Header
          currentUser={currentUser}
          alertsCount={2}
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

            {/* Student View */}
            {activeTab !== 'iot_simulator' && currentRole === 'student' && (
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

            {/* Faculty View */}
            {activeTab !== 'iot_simulator' && currentRole === 'faculty' && (
              <FacultyDashboard
                user={currentUser}
                timetable={timetable}
                classrooms={classrooms}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* Admin View */}
            {activeTab !== 'iot_simulator' && currentRole === 'admin' && (
              <AdminDashboard
                classrooms={classrooms}
                timetable={timetable}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}

            {/* Parent View */}
            {activeTab !== 'iot_simulator' && currentRole === 'parent' && (
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
