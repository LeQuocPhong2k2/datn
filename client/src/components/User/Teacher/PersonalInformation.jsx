/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import 'flowbite';
import { useEffect, useState, useContext } from 'react';

import Menu from './Menu';
import { UserContext } from '../../../UserContext';
import { getGiaoVienByPhoneNumber } from '../../../api/Teacher';

function PersonalInformation() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    console.log('user context là ', user);
  }, [user]);

  const phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
  const [teacherInfo, setTeacherInfo] = useState({});
  useEffect(() => {
    console.log(teacherInfo);
  }, [teacherInfo]);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getGiaoVienByPhoneNumber(phoneNumber);
        setTeacherInfo(response);
        console.log('Thông tin giáo viên:', response);
        // lưu tên giáo viên trong localStorage
        localStorage.setItem('teacherName', response.userName);
        // trong thông tin giáo viên có array LopChuNhiem trong đó có _id của class mà giáo viên đó chủ nhiệm hãy lưu vào cookie để dùng cho việc điểm danh
        sessionStorage.setItem('classId', response.lopChuNhiem[0]._id);
      } catch (error) {
        console.error('Lỗi lấy thông tin giáo viên:', error);
      }
    };
    fetchTeacherInfo();
  }, [phoneNumber]);
  return (
    <Menu active="personal-information">
      <div className="p-4">
        <div className="rounded shadow bg-white ">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i className="fas fa-info-circle pr-2"></i>THÔNG TIN CHUNG
            </h2>
          </div>
          <div className="px-4 py-4 flex items-center justify-start text-lg">
            <div className="w-1/3 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4537/4537074.png"
                alt="Student Profile"
                className="rounded-full mx-auto"
                style={{ width: '200px', height: '200px' }}
              />

              <p className="font-bold" style={{ color: '#0B6FA1' }}>
                {teacherInfo.userName}
              </p>
              {/* <p style={{ color: '#0B6FA1' }}> Năm học :{studentInfo.academicYear}</p> */}
            </div>
            <div className="w-2/3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Họ tên: </strong>
                  {teacherInfo.userName}
                </div>
                <div>
                  <strong>Giới tính: </strong>
                  {teacherInfo.gender}
                </div>
                <div>
                  <strong>SĐT: </strong>
                  {teacherInfo.phoneNumber}
                </div>
                <div>
                  <strong>Trình độ: </strong>
                  {teacherInfo.levelOfExpertise}
                </div>

                <div>
                  <strong>Địa chỉ: </strong>
                  {teacherInfo.address}
                </div>
                <div>
                  <strong>Ngày bắt đầu công tác: </strong>{' '}
                  {new Date(teacherInfo.dateOfEnrollment).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>

                <div>
                  <strong>Bộ môn giảng dạy: </strong>
                  {teacherInfo.department}
                </div>
                <div>
                  <strong>Lớp Chủ Nhiệm: </strong>
                  {/* {teacherInfo.lopChuNhiem && teacherInfo.lopChuNhiem.length > 0
                    ? teacherInfo.lopChuNhiem[0].className
                    : 'Chưa có lớp chủ nhiệm'} */}
                  {user.className}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}

export default PersonalInformation;
