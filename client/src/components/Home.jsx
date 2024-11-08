import React from 'react';
import 'flowbite';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import '../HomePage.css';

export default function Home() {
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     const role = localStorage.getItem('role');
  //     if (role === 'Admin') {
  //       navigate('/');
  //     } else if (role === 'Teacher') {
  //       navigate('/teacher');
  //     } else if (role === 'Student') {
  //       navigate('/student');
  //     } else {
  //       navigate('/login');
  //     }
  //   }, [navigate]);
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Welcome to iuhEdu - Electronic Contact Book</h1>
        <p>Connecting students, parents, and teachers in one platform.</p>
        <Link to="/login" className="cta-button">
          Get Started
        </Link>
      </header>

      <section className="features-section">
        <div className="features">
          <div className="feature">
            <h3>Student Management</h3>
            <p>Track and manage student progress, attendance, and scores.</p>
          </div>
          <div className="feature">
            <h3>Parent Communication</h3>
            <p>Stay connected with parents through updates and notifications.</p>
          </div>
          <div className="feature">
            <h3>Classroom Insights</h3>
            <p>Monitor class performance and provide valuable feedback.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About Edu</h2>
        <p>
          Edu is an innovative solution designed to simplify and improve communication between students, parents, and
          teachers, helping everyone stay informed and engaged in the educational journey.
        </p>
        <Link to="/about" className="learn-more-link">
          Learn More
        </Link>
      </section>

      <footer className="footer fixed bottom-0 w-screen">
        <p>&copy; 2024 Edu. All rights reserved.</p>
      </footer>
    </div>
  );
}
