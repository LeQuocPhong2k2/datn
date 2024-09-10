import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./components/Admin/index";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
