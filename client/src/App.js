import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Login from './components/Login';
import Admin from './components/Admin';
import Student from './components/User/index';
// import Teacher from './components/User/Teacher';
import ForgotPassword from './components/User/ForgotPassword';
import Error from './components/Error';
import ProtectedRoute from './middleware/ProtectedRoute';
import Cookies from 'cookie-universal';
import Message from './components/User/Teacher/Message';
import TeachingPlans from './components/User/Teacher/TeachingPlans';
import TeachingReport from './components/User/Teacher/TeachingReport';
import InputScore from './components/User/Teacher/InputScore';
import PersonalInformation from './components/User/Teacher/PersonalInformation';
import TeachingSchedule from './components/User/Teacher/TeachingSchedule';
import StudentAttendance from './components/User/Teacher/StudentAttendance';
import Notification from './components/User/Teacher/Notification';
import LeaveRequest from './components/User/Teacher/LeaveRequest';
import Report from './components/User/Teacher/Report';
import './App.css';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const cookies = new Cookies();
    const isLoggedIn = cookies.get('access_token');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/error" element={<Error />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Teacher />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="Student">
              <Student />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Teacher />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/teacher" element={<Navigate to="/teacher/teaching-schedule" replace />} />
        <Route
          path="/teacher/menu"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Message />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/teaching-plans"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <TeachingPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/teaching-report"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <TeachingReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/input-score"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <InputScore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/personal-information"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <PersonalInformation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/teaching-schedule"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <TeachingSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/student-attendance"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <StudentAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/notification"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/leave-request"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <LeaveRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/report"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Report />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
