import React from 'react';
import 'flowbite';

import { useEffect, useState, useRef } from 'react';

import imgLogo from '../../../assets/logo_datn_png.png';

import { IoMdArrowDropdown } from 'react-icons/io';
import { IoMdArrowDropup } from 'react-icons/io';
import { TbGridDots } from 'react-icons/tb';
import { SiGoogleclassroom } from 'react-icons/si';

import { Toaster, toast } from 'react-hot-toast';

import { changePassword } from '../../../api/Accounts';
import { getHomRoomTeacherCurrent } from '../../../api/Class';

export default function Menu({ children, active }) {
  /**
   *
   */
  const [pageLoading, setPageLoading] = useState(true);
  const [toggleMenu, setToggleMenu] = useState(true);
  const [showAllMenu, setShowAllMenu] = useState(true);
  const [showTeacherProfile, setShowTeacherProfile] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [teacherInfo, setTeacherInfo] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  useEffect(() => {
    toast.remove();
    handlePageLoading();
  }, []);

  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  useEffect(() => {
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    getHomRoomTeacherCurrent(teacher_phoneNumber)
      .then((res) => {
        setTeacherInfo(res);
      })
      .catch((error) => {
        console.log(error);
      });
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
      // gọi tới api changePassword do userName trong studentInfo là tên còn trong account là mã học sinh nên ở đây truyền mã học sinh
      changePassword(teacherInfo.phoneNumber, oldPassword, newPassword)
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
      {pageLoading && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-screen h-screen items-center justify-center overflow-auto relative"
        >
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
          </button>
        </div>
      )}
      {!pageLoading && (
        <div className="h-screen grid grid-cols-10 gap-[1px] font-sans bg-gray-100">
          {toggleMenu && (
            <div className={`col-span-2 h-screen bg-white shadow-lg`}>
              <div
                className={`h-14 grid grid-cols-10 items-center justify-start border-b px-5 ${showAllMenu ? 'block' : 'hidden'}`}
              >
                <div className="col-span-8">
                  <span className="text-xl text-black font-semibold">{teacherInfo.userName}</span>
                  <br />

                  <span className="text-lg text-gray-800">
                    {teacherInfo.className === ''
                      ? 'Lớp chủ nhiệm: Chờ phân công'
                      : 'Lớp chủ nhiệm: ' + teacherInfo.className}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end">
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
              <div className="px-5 mt-10">
                <div>
                  <p className="text-lg font-bold text-gray-500">Chức năng</p>
                </div>
                <ul>
                  <li
                    className={` ${active === 'message' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/message">
                      <i style={{ color: '#d55557' }} className="fa-regular fa-message mr-2"></i>
                      Tin nhắn
                    </a>
                  </li>
                  <li
                    className={` ${active === 'calendar-teaching' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/attendance-management">
                      <i style={{ color: '#d55557' }} className="fa-regular fa-calendar mr-2"></i>
                      Lịch giảng dạy
                    </a>
                  </li>
                  <li
                    className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/attendance-management">
                      <i style={{ color: '#d55557' }} className="fas fa-calendar-alt mr-2"></i>
                      Quản lý điểm danh
                    </a>
                  </li>
                  <li
                    className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/class-management">
                      <i style={{ color: '#d55557' }} className="fas fa-chalkboard-teacher mr-2"></i>
                      Quản lý lớp học
                    </a>
                  </li>
                  <li
                    className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/student-management">
                      <i style={{ color: '#d55557' }} className="fas fa-user-graduate mr-2"></i>
                      Quản lý học sinh
                    </a>
                  </li>
                  {/* mục quản lý điểm sô */}
                  <li
                    className={` ${active === 'tin-nhan' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/grade-management">
                      <i style={{ color: '#d55557' }} className="fas fa-chart-bar mr-2"></i>
                      Quản lý điểm số
                    </a>
                  </li>
                  {/* thêm mục kế hoạch giảng dạy */}
                  <li
                    className={` ${active === 'teaching-plans' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/teaching-plans">
                      <i style={{ color: '#d55557' }} className="fas fa-calendar-plus mr-2"></i>
                      Quản lý kế hoạch giảng dạy
                    </a>
                  </li>
                  <li
                    className={` ${active === 'teaching-report' ? 'bg-gray-300' : 'bg-white'} px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/teaching-report">
                      <i style={{ color: '#d55557' }} class="fa-solid fa-briefcase mr-2"></i>
                      Báo bài
                    </a>
                  </li>
                </ul>
                <div>
                  <p className="text-lg font-bold text-gray-500">Lơp học của tôi</p>
                </div>
                <ul>
                  <li
                    className={` ${active === 'random-student' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex items-center" href="/teacher/message">
                      <SiGoogleclassroom style={{ color: '#d55557' }} className="mr-2" />
                      {teacherInfo.className === '' ? 'Chờ phân công' : teacherInfo.className}
                    </a>
                  </li>
                  <li
                    className={` ${active === 'time-counter' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex items-center" href="/teacher/message">
                      <TbGridDots style={{ color: '#d55557' }} className="mr-2" />
                      Tất cả lớp học
                    </a>
                  </li>
                </ul>
                <div>
                  <p className="text-lg font-bold text-gray-500">Bộ công cụ</p>
                </div>
                <ul>
                  <li
                    className={` ${active === 'random-student' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/message">
                      <i style={{ color: '#d55557' }} className="fa-solid fa-shuffle mr-2"></i>
                      Ngẫu nhiên học sinh
                    </a>
                  </li>
                  <li
                    className={` ${active === 'time-counter' ? 'bg-gray-300' : 'bg-white'} w-full px-5 py-2 my-2 text-lg text-black font-semibold rounded-full hover:bg-gray-300 cursor-pointer`}
                  >
                    <a className="w-full flex justify-start items-center" href="/teacher/message">
                      <i style={{ color: '#d55557' }} className="fa-regular fa-clock mr-2"></i>
                      Bộ đếm thời gian
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className={`${toggleMenu ? 'col-span-8' : 'col-span-10'} h-screen`}>
            <Toaster toastOptions={{ duration: 2500 }} />
            <header className="grid grid-flow-col items-center p-2 bg-white border-b border-gray-300">
              <div className="flex items-center justify-start gap-2">
                {!toggleMenu && (
                  <button
                    onClick={() => {
                      setToggleMenu(!toggleMenu);
                    }}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <span className="sr-only">Toggle menu</span>
                    <i className="fas fa-bars"></i>
                  </button>
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
                  <div className="relative ">
                    <span
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setShowTeacherProfile(true);
                        setActiveTab('notice');
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
                      {teacherInfo.userName}
                      {showProfile ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                    </div>
                    {showProfile && (
                      <div className="w-44 absolute shadow-md border z-50 rounded-md bg-white right-1 top-7">
                        <div
                          className="py-2 px-2 hover:bg-gray-300 cursor-pointer"
                          onClick={() => {
                            setShowTeacherProfile(true);
                            setActiveTab('profile');
                            setShowAllMenu(false);
                            setShowProfile(false);
                          }}
                        >
                          <span>Thông tin cá nhân</span>
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
                {/* Hiện menu cho màn hình điện thoại */}{' '}
                <button className="md:hidden">
                  <i className="fas fa-bars" style={{ color: '#429AB8' }}></i> {/* Dấu ba gạch */}
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
            <div className="overflow-y-auto max-h-[93%]">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
