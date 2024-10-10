import 'flowbite';
import { useState } from 'react';
import { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie'; // Thêm import để sử dụng Cookies
// import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster, toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [mshs, setMshs] = useState('');
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleForgotPassword = () => {
    // kiểm tra xử lý rỗng
    if (mshs === '' || fullname === '' || phoneNumber === '') {
      toast.dismiss();
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    } else {
      alert(mshs + ' ' + fullname + ' ' + phoneNumber);
    }
  };
  useEffect(() => {}, []);
  return (
    <div>
      <header className="bg-white p-4 border-b border-gray-300 flex justify-between items-center mb-16 md: mb-4">
        <Toaster toastOptions={{ duration: 2200 }} />
        <a href="/login">
          <img
            src="https://i.imgur.com/jRMcFwo_d.png?maxwidth=520&shape=thumb&fidelity=high"
            alt="SMAS Logo"
            className="h-12"
          />
        </a>
        <div className="flex items-center">
          {/* Hiển thị menu cho màn hình desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <span
              className="flex items-center"
              onClick={() =>
                window.open(
                  'https://mail.google.com/mail/?view=cm&fs=1&to=duct6984@gmail.com&su=Góp ý về website sổ liên lạc điện tử',
                  '_blank'
                )
              }
            >
              <i className="fas fa-envelope mr-2" style={{ color: '#429AB8' }}></i>Hộp thư góp ý
            </span>
            <span className="flex items-center">
              <i className="fas fa-phone mr-2" style={{ color: '#429AB8' }}></i>0907021954
            </span>
            <span className="flex items-center">
              <i className="fas fa-school mr-2" style={{ color: '#429AB8' }}></i>
              {/* Thêm biểu tượng trường học với màu xanh dạng #429AB8 */}
              Trường Tiểu học Nguyễn Bỉnh Khiêm
            </span>
          </div>
          {/* Hiện menu cho màn hình điện thoại */}{' '}
          <button onClick={() => setMenuOpen(!isMenuOpen)} className="md:hidden">
            <i className="fas fa-bars" style={{ color: '#429AB8' }}></i> {/* Dấu ba gạch */}
          </button>
        </div>
        {isMenuOpen && ( // đây là menu cho responsive mobile hiện
          <div className="absolute left-0 bg-white shadow-lg p-4 md:hidden" style={{ top: '0px' }}>
            <span className="flex items-center">
              <i className="fas fa-school mr-2" style={{ color: '#429AB8' }}></i>
              Trường Tiểu học Nguyễn Bỉnh Khiêm
            </span>
            <span className="flex items-center">
              <i className="fas fa-phone mr-2" style={{ color: '#429AB8' }}></i>SĐT Hỗ Trợ : 0907021954
            </span>

            <span className="flex items-center">
              <i className="fas fa-envelope mr-2" style={{ color: '#429AB8' }}></i>Hộp thư Góp Ý
            </span>
          </div>
        )}
      </header>
      <div
        className={`max-w-lg mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow-md  ${window.innerWidth <= 768 ? 'w-80' : 'w-full'}`}
      >
        <h1 className="text-center text-[#427CAC] text-2xl font-bold mb-6">LẤY LẠI MẬT KHẨU</h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mssv">
              MSHS <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="mssv"
              type="text"
              placeholder="Nhập mã số học sinh.."
              onChange={(e) => setMshs(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
              Họ và tên học sinh <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullname"
              type="text"
              placeholder="Nhập đầy đủ Họ và Tên.."
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Nhập đã khai báo trên hệ thống.."
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-[#427CAC] hover:bg-[#3a6d99] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleForgotPassword}
            >
              Thực hiện
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <a href="/login" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
