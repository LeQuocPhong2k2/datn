import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Admin from './components/Admin';
import Student from './components/User/index';
import Teacher from './components/User/Teacher';
import Teacher2 from './components/User/Teacherv2';
import ForgotPassword from './components/User/ForgotPassword';
import Error from './components/Error';
import Home from './components/Home';
import ProtectedRoute from './middleware/ProtectedRoute';
import Cookies from 'cookie-universal';
import Message from './components/User/Teacher/Message';
import TeachingPlans from './components/User/Teacher/TeachingPlans';
import TeachingReport from './components/User/Teacher/TeachingReport';
import InputScore from './components/User/InputScore';
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
        <Route path="" element={<Home />} />
        <Route path="/" element={<Home />} />
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
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="Student">
              <Student />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Teacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher2"
          element={
            <ProtectedRoute allowedRole="Teacher">
              <Teacher2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/message"
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
      </Routes>
    </div>
  );
}

export default App;
