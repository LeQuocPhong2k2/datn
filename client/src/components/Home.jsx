import React from 'react';
import 'flowbite';
import { useEffect } from 'react';

import imgLogoWhite from '../assets/logo_datn_png_white.png';
import imgLogo from '../assets/logo_datn_png.png';
import imgBanner from '../assets/banner.jpg';
import imgEvent1 from '../assets/event1.jpg';
import imgBangDiem from '../assets/bang-diem.jpg';
import imgLichHoc from '../assets/lich-hoc.png';

import { FiPhoneCall } from 'react-icons/fi';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import '../HomePage.css';

export default function Home() {
  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);
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
      <div className="h-16 flex items-center justify-center gap-5 px-10 fixed top-0 bg-sky-800 text-white w-screen z-50 shadow">
        <div id="logo">
          <img className="w-28 h-12" src={imgLogoWhite} alt="Rounded avatar" />
        </div>
        <div id="search" className="w-2/4">
          <input type="text" className="w-full rounded-md" placeholder="Tìm kiếm ..." />
        </div>
        <div className="grid grid-flow-col gap-10">
          <div id="info" className="flex items-center justify-start gap-1 cursor-pointer">
            <MdOutlineEmail className="text-xl" />
            <div>
              <span className="">tthcn@gamil.com</span>
            </div>
          </div>
          <div id="hotline" className="flex items-center justify-start gap-1 cursor-pointer">
            <FiPhoneCall className="text-xl" />
            <div>
              <span className="">1900.636.099</span>
            </div>
          </div>
          <div id="login" className="flex items-center justify-start gap-1 cursor-pointer">
            <FaRegCircleUser className="text-xl" />
            <span className="">Đăng nhập</span>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-center">
        <div className="flex items-center justify-start text-center mt-28 gap-1">
          <img className="w-20 h-9" src={imgLogo} alt="Rounded avatar" />
          <span className="text-4xl text-gray-900">Sổ liên lạc điện tử</span>
          <span className="text-4xl text-gray-700">IUH</span>
        </div>
      </div>
      <div className="flex items-end justify-center pt-5">
        <div className="flex items-center w-3/5 text-center">
          <span className="text-7xl font-bold text-black">Nơi giảng dạy và học tập kết hợp với nhau</span>
        </div>
      </div>
      <div className="flex items-end justify-center pt-5">
        <div className="w-3/5 text-center text-black">
          <span className="text-xl">
            Ứng dụng giúp kết nối nhà trường và gia đình,cung cấp nền tảng theo dõi thông tin học tập, điểm số, lịch học{' '}
          </span>
          <br />
          <span className="text-xl">
            và thông báo quan trọng. Giao diện thân thiện, dễ sử dụng, giúp phụ huynh theo dõi sự tiến bộ của học sinh
            một cách nhanh chóng và hiệu quả. Khám phá các tính năng tiện lợi cho việc quản lý học tập và giao tiếp
            trong môi trường giáo dục.
          </span>
        </div>
      </div>
      <div className="flex items-end justify-center pt-5">
        <div className="flex items-end justify-center gap-4">
          <button className="p-2 px-4 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700">Contact us</button>
          <button className="border p-2 px-4 text-blue-600 text-lg rounded-md hover:ring-1 hover:ring-blue-500 hover:bg-gray-100">
            <a href="/login">Sign in to IuhEdu</a>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center py-10">
        <div className="border w-1/5 border-gray-700 opacity-60"></div>
      </div>

      <div className="flex items-start justify-center gap-4 bg-white">
        <img className="w-[40%] overflow-hidden rounded-3xl" src={imgBangDiem} alt="Rounded avatar" />
        <div className="">
          <p className="text-4xl text-blue-900">Theo dõi điểm số và học lực</p>
          <p className="text-xl">Phụ huynh và học sinh có thể dễ dàng theo dõi điểm số các môn học,</p>
          <p className="text-xl">nhận thông báo khi có cập nhật điểm mới từ giáo viên.</p>
        </div>
      </div>
      <div className="flex items-start justify-center gap-4 mt-20 py-10 bg-slate-100">
        <div className="">
          <p className="text-4xl text-blue-900">Lịch học và thông báo</p>
          <p className="text-xl">Ứng dụng cung cấp lịch học chi tiết và thông báo quan trọng từ nhà trường,</p>
          <p className="text-xl">giúp phụ huynh và học sinh không bỏ lỡ bất kỳ thông tin nào.</p>
        </div>
        <img className="w-[50%] h-[30rem] overflow-hidden rounded-3xl" src={imgLichHoc} alt="Rounded avatar" />
      </div>
      <footer className="footer w-full">
        <p>&copy; 2024 Edu. All rights reserved.</p>
      </footer>
      {/* <div className="h-16 flex items-center justify-center gap-5 px-10 fixed top-0 bg-white w-screen z-50 shadow">
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
      </footer> */}
    </div>
  );
}
