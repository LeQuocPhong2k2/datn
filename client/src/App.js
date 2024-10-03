import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './components/Admin/index';
import Login from './components/Login';
import Home from './components/Home';
import Student from './components/User/index';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<Student />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
