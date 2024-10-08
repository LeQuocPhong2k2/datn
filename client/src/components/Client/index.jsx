import 'flowbite';
import { useEffect } from 'react';
import Cookies from 'js-cookie'; // Thêm import để sử dụng Cookies
// import { jwtDecode } from 'jwt-decode';

export default function Student() {
  useEffect(() => {
    const student_token = Cookies.get('student_token'); // Lấy token từ cookie
    if (!student_token) {
      window.location.href = '/login'; // Nếu không có token, chuyển hướng về trang login
    }
  }, []);
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-4">Student</h1>
    </div>
  );
}
