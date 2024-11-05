import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Student from './components/User/index';
import Teacher from './components/User/Teacher';
import ForgotPassword from './components/User/ForgotPassword';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {userRole === 'Admin' && <Route path="/" element={<Home />} />}
          {userRole === 'Student' && <Route path="/student" element={<Student />} />}
          {userRole === 'Teacher' && <Route path="/teacher" element={<Teacher />} />}
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
