import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Student from './components/Client/index';
import Login from './components/Login';
import Home from './components/Home';
import Student from './components/User/index';
import Teacher from './components/User/Teacher';
import ForgotPassword from './components/User/ForgotPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<Student />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/" element={<Home />} />
          <Route path="/teacher" element={<Teacher />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
