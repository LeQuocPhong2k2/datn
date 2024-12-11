/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import imgLogo from '../../../assets/logo_datn_png.png';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../UserContext';

import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';

import { changePassword } from '../../../api/Accounts';

export default function Menu({ children, active }) {
  /**
   *
   */
  const { user } = useContext(UserContext);
  const [toggleMenu, setToggleMenu] = useState(true);
  const [showAllMenu, setShowAllMenu] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  useEffect(() => {
    document.title = 'Trang chủ giáo viên';
  }, []);

  /**
   *
   */
  // sự kiện khi bấm nút lưu mật khẩu
  const handleChangePassword = () => {
    // kiểm tra có nhập đủ thông tin không

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.dismiss();
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // so sánh mật khẩu mới và mật khẩu xác nhận có giống nhau không
    else if (newPassword !== confirmPassword) {
      toast.dismiss();
      toast.error('Mật khẩu xác nhận không đúng');
      return;
    } else {
      const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
      changePassword(phoneNumber, oldPassword, newPassword)
        .then((res) => {
          toast.dismiss();
          toast.success(res.data.message);
          setShowChangePassword(false);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  return (
    <>
      <Toaster toastOptions={{ duration: 2200 }} />
      <div className="h-screen w-screen flex flex-row gap-[1px] font-sans ">
        {toggleMenu && (
          <div className={`min-w-64 h-screen max-h-screen overflow-y-auto lg:relative fixed bg-white shadow-lg z-50`}>
            <div className={`h-14 grid grid-cols-10 items-center justify-start border-b px-5`}>
              <div className="col-span-8">
                <span className="text-xl text-black font-semibold">Gv.{user.userName}</span>
                <br />

                <div className="flex items-center justify-start min-w-80">
                  <span className="text-lg text-gray-800">
                    {user.className === '' ? 'Lớp chủ nhiệm: Chờ phân công' : 'Lớp chủ nhiệm: ' + user.className}
                  </span>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end md:justify-center">
                <button
                  onClick={() => {
                    setToggleMenu(!toggleMenu);
                  }}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <span className="sr-only">Toggle menu</span>
                  <i className="fas fa-bars"></i>
                </button>
              </div>
            </div>
            <div className="px-5 md:px-2 lg:px-4">
              <ul>
                <li
                  className={` ${active === 'personal-information' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/personal-information">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-circle-info mr-2"></i>
                      Thông tin cá nhân
                    </span>
                  </Link>
                </li>
                <li
                  className={` ${active === 'teaching-schedule' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/teaching-schedule">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} className="fa-regular fa-calendar mr-2"></i>
                      Lịch giảng dạy
                    </span>
                  </Link>
                </li>
                {user.className !== '' && (
                  <li
                    className={` ${active === 'tkb-schedule' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <Link to="/teacher/tkb-schedule">
                      <span className="w-full flex justify-start items-center">
                        <i style={{ color: '#d55557' }} className="fa-regular fa-calendar mr-2"></i>
                        TKB Lớp {user.className}
                      </span>
                    </Link>
                  </li>
                )}

                {/* <li
                  className={` ${active === 'notification' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/notification">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-bell mr-2"></i>
                      Quản lý thông báo
                    </span>
                  </Link>
                </li> */}
                {user.className !== '' && (
                  <>
                    <li
                      className={` ${active === 'notification' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                    >
                      <Link to="/teacher/notification">
                        <span className="w-full flex justify-start items-center">
                          <i style={{ color: '#d55557' }} class="fa-solid fa-bell mr-2"></i>
                          Quản lý thông báo
                        </span>
                      </Link>
                    </li>
                    <li
                      className={` ${active === 'student-attendance' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                    >
                      <Link to="/teacher/student-attendance">
                        <span className="w-full flex justify-start items-center">
                          <i style={{ color: '#d55557' }} className="fas fa-calendar-alt mr-2"></i>
                          Quản lý điểm danh
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                <li
                  className={` ${active === 'leave-request' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/leave-request">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-envelope-open-text mr-2"></i>
                      Đơn xin nghỉ học
                    </span>
                  </Link>
                </li>

                <li
                  className={` ${active === 'teaching-report' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/teaching-report">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-briefcase mr-2"></i>
                      Quản lý báo bài
                    </span>
                  </Link>
                </li>

                {/* <li
                  className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <a className="w-full flex justify-start items-center" href="/teacher/class-management">
                    <i style={{ color: '#d55557' }} className="fas fa-chalkboard-teacher mr-2"></i>
                    Quản lý lớp học
                  </a>
                </li> */}
                {/* <li
                  className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <a className="w-full flex justify-start items-center" href="/teacher/student-management">
                    <i style={{ color: '#d55557' }} className="fas fa-user-graduate mr-2"></i>
                    Quản lý học sinh
                  </a>
                </li> */}
                {/* mục quản lý điểm sô */}
                <li
                  className={` ${active === 'input-score' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/input-score">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} className="fas fa-chart-bar mr-2"></i>
                      Quản lý điểm số
                    </span>
                  </Link>
                </li>
                <li
                  className={` ${active === 'report' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <Link to="/teacher/report">
                    <span className="w-full flex justify-start items-center">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-chart-pie mr-2"></i>
                      Thống kê
                    </span>
                  </Link>
                </li>
                {/* thêm mục kế hoạch giảng dạy */}
                {/* <li
                  className={` ${active === 'teaching-plans' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 md:px-2 md:text-sm lg:text-lg lg:px-4 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                >
                  <a className="w-full flex justify-start items-center" href="/teacher/teaching-plans">
                    <i style={{ color: '#d55557' }} className="fas fa-calendar-plus mr-2"></i>
                    Quản lý kế hoạch giảng dạy
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        )}

        <div className={`w-full h-screen flex flex-col lex-1 bg-gray-300 overflow-x-auto `}>
          <Toaster toastOptions={{ duration: 2500 }} />
          <header className="grid grid-flow-col items-center p-2 bg-white shadow-md z-50">
            <div className="flex items-center justify-start gap-2">
              {!toggleMenu && (
                <button
                  onClick={() => {
                    setToggleMenu(!toggleMenu);
                  }}
                  className="text-lg md:block hidden"
                >
                  <i className="fas fa-bars" style={{ color: '#429AB8' }}></i>
                </button>
                // <button
                //   onClick={() => {
                //     setToggleMenu(!toggleMenu);
                //   }}
                //   className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                // >
                //   <span className="sr-only">Toggle menu</span>
                //   <i className="fas fa-bars"></i>
                // </button>
              )}

              <a href="/teacher">
                <img className="h-10" src={imgLogo} alt="Rounded avatar" />
              </a>
            </div>
            <div className="flex items-center justify-end px-4 text-black text-lg font-normal">
              <div className="hidden md:flex items-center space-x-4 gap-2">
                <span
                  className="flex items-center cursor-default hover:cursor-pointer"
                  onClick={() =>
                    window.open(
                      'https://mail.google.com/mail/?view=cm&fs=1&to=duct6984@gmail.com&su=Góp ý về website sổ liên lạc điện tử',
                      '_blank'
                    )
                  }
                >
                  <i className="fas fa-envelope mr-2" style={{ color: '#f6a9a7' }}></i>Hộp thư góp ý
                </span>
                <span className="flex items-center cursor-pointer">
                  <a href="tel:0907021954" style={{ textDecoration: 'none' }}>
                    <i className="fas fa-phone mr-2" style={{ color: '#77ac2f' }}></i>0907021954
                  </a>
                </span>
                <div className="relative">
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setShowAllMenu(false);
                    }}
                  >
                    <i className="fas fa-bell mr-2" style={{ color: '#d55557' }}></i>
                    Thông báo
                  </span>
                </div>
                <div className="relative" style={{ userSelect: 'none' }}>
                  <div
                    className="flex items-center justify-start cursor-pointer"
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    <i className="fas fa-user-circle mr-2" style={{ color: '#429AB8' }}></i>
                    {user.userName}
                    {showProfile ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                  </div>
                  {showProfile && (
                    <div className="w-44 absolute shadow-md border z-50 rounded-md bg-white right-1 top-7">
                      <div
                        className="py-2 px-2 hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowAllMenu(false);
                          setShowProfile(false);
                        }}
                      >
                        <Link to="/teacher/personal-information">
                          <span>Thông tin cá nhân</span>
                        </Link>
                      </div>
                      <div
                        className="py-2 px-2 hover:bg-gray-300 cursor-pointer"
                        onClick={() => {
                          setShowChangePassword(true);
                          setShowProfile(false);
                        }}
                      >
                        <span>Đổi mật khẩu</span>
                      </div>
                      <div className="py-2 px-2 hover:bg-gray-300 cursor-pointer">
                        <a href="/login">Đăng xuất</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Hiện menu cho màn hình điện thoại */}
              <button
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
                className="md:hidden"
              >
                <i className="fas fa-bars" style={{ color: '#429AB8' }}></i>
              </button>
            </div>

            {showChangePassword && ( // form thay đổi mật khẩu
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                onClick={() => setShowChangePassword(false)}
              >
                <div
                  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end">
                    <button
                      className="text-blue-500"
                      onClick={() => setShowChangePassword(false)} // Close the modal
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <form>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mật khẩu cũ <span className="text-red-500">(*)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Mật khẩu mới <span className="text-red-500">(*)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Xác nhận mật khẩu <span className="text-red-500">(*)</span>
                      </label>
                      <input
                        type="password"
                        placeholder="Xác nhận lại mật khẩu"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={handleChangePassword}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Lưu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </header>
          <div className="overflow-y-auto flex-1 h-full">{children}</div>
        </div>
      </div>
    </>
  );
}
