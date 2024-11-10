import React from 'react';
import 'flowbite';
import imgLogo from '../assets/logo_datn_png.png';
import imgBanner from '../assets/banner.jpg';
import imgEvent1 from '../assets/event1.jpg';

import { FiPhoneCall } from 'react-icons/fi';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';

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
      <div className="h-16 flex items-center justify-center gap-5 px-10 fixed top-0 bg-white w-screen z-50 shadow">
        <div id="logo">
          <img className="w-28 h-12" src={imgLogo} alt="Rounded avatar" />
        </div>
        <div id="search" className="w-2/4">
          <input type="text" className="w-full rounded-md" placeholder="Tìm kiếm ..." />
        </div>
        <div className="grid grid-flow-col gap-4">
          <div id="info" className="flex items-center justify-start gap-1">
            <MdOutlineEmail className="text-3xl text-sky-500" />
            <div>
              <span>Email</span>
              <br />
              <span className="font-semibold">tthcn@gamil.com</span>
            </div>
          </div>
          <div id="hotline" className="flex items-center justify-start gap-1">
            <FiPhoneCall className="text-3xl text-sky-500" />
            <div>
              <span>Hotline</span>
              <br />
              <span className="font-semibold">1900.636.099</span>
            </div>
          </div>
          <div id="login" className="flex items-center justify-start gap-1">
            <FaRegCircleUser className="text-3xl text-sky-500" />
            <span className="font-semibold">Đăng nhập</span>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-flow-row items-center relative">
        <div className="text-center">
          <span className="font-semibold text-2xl text-sky-700">SỔ TAY LIÊN LẠC ĐIỆN TỬ</span>
          <br />
          <span className="font-semibold text-xl text-red-700">TRƯỜNG TIỂU HỌC CÔNG NGHIỆP HỒ CHÍ MINH</span>
        </div>
        <div className="flex items-center justify-center">
          <img className="w-2/3 h-96" src={imgBanner} alt="Rounded avatar" />
        </div>
      </div>
      <div className="flex items-center justify-center py-4">
        <div className="w-2/3 bg-gray-200 ">
          <div>
            <span className="text-lg font-semibold text-purple-900">TIN TỨC - SỰ KIỆN</span>
            <div className="noti-elm">
              <div>
                <img className="" src={imgEvent1} alt="Rounded avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>

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
