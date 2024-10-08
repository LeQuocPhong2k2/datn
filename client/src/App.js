import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Student from './components/Client/index';
import Login from './components/Login';
import Home from './components/Home';
import Student from './components/User/index';
import Test from './components/User/test';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<Student />} />
          <Route path="/test" element={<Test />} />

          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
