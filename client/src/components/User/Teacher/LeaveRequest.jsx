/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from '../../../UserContext';

import Menu from './Menu';

import { updateLeaveRequest } from '../../../api/LeaveRequest';
import { createAttendance } from '../../../api/Attendance';
import { getLeaveRequestsByTeacherId } from '../../../api/LeaveRequest';

export default function LeaveRequest() {
  const { user } = useContext(UserContext);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showTeacherLeaveRequests, setShowTeacherLeaveRequests] = useState(true);
  const [showFullInfoLeaveRequestSent, setShowFullInfoLeaveRequestSent] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const filteredRequests = leaveRequests.filter((request) =>
    filterStatus === 'all' ? true : request.status === filterStatus
  );

  const handleUpdateLeaveRequest = async (leaveRequest_id, status) => {
    // alert ra leaveRequest_id và status

    try {
      const response = await updateLeaveRequest(leaveRequest_id, status);
      console.log('Cập nhật đơn nghỉ học:', response);
      // cập nhật lại danh sách đơn nghỉ học
      const updatedLeaveRequests = leaveRequests.map((request) =>
        request._id === leaveRequest_id ? { ...request, status } : request
      );
      setLeaveRequests(updatedLeaveRequests);
      toast.success('Cập nhật đơn nghỉ học thành công');
      setShowFullInfoLeaveRequestSent(false);
      setShowTeacherLeaveRequests(true);
      // chuyển qua tab đã duyệt
      if (status === 'approved') {
        setFilterStatus('approved');
      } else if (status === 'rejected') {
        setFilterStatus('rejected');
      }
    } catch (error) {
      console.error('Lỗi cập nhật đơn nghỉ học:', error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn nghỉ học');
    }
  };

  const createAttendanceByLeaveRequest = async (leaveRequest, status) => {
    try {
      // Lặp qua từng phiên (session) trong đơn xin nghỉ
      for (const session of leaveRequest.sessions) {
        // Chuyển đổi ngày từ MongoDB ObjectId date sang định dạng Date thông thường
        // Sử dụng cách khác để parse ngày
        const sessionDate = session.date instanceof Date ? session.date : new Date(session.date.$date || session.date);
        // console.log lúc đầu để kiểm tra xem sessionDate ra giá trị nào
        console.log('sessionDate:', sessionDate);

        // Kiểm tra xem ngày có hợp lệ không
        if (isNaN(sessionDate.getTime())) {
          console.error('Invalid date:', session.date);
          continue; // Bỏ qua session không hợp lệ
        }

        // Tạo attendanceRecords cho từng học sinh trong session
        const attendanceRecords = [
          {
            student_id: leaveRequest.student_id,
            status: status === 'approved' ? 'VCP' : 'VKP', // VCP: Vắng có phép, VKP: Vắng không phép
            reason: status === 'approved' ? 'Học sinh vắng có phép' : 'Học sinh vắng không phép',
            leaveRequest_id: leaveRequest._id,
          },
        ];

        sessionDate.setHours(sessionDate.getHours() + 7);

        // Gọi hàm createAttendance cho từng ngày
        await createAttendance(leaveRequest.class_id, leaveRequest.teacher_id, sessionDate, attendanceRecords);
        // console.log thông báo đã tạo thành công từ ngày sessionDate
        console.log(`Đã tạo điểm danh từ ngày ${sessionDate}`);
      }

      toast.success('Đã tạo điểm danh từ đơn nghỉ học cho các ngày được chọn');
    } catch (error) {
      console.error('Lỗi cập nhật đơn nghỉ học:', error);
      toast.error('Có lỗi xảy ra khi cập nhật đơn nghỉ học');
    }
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!user.teacherId) return;

      try {
        const response = await getLeaveRequestsByTeacherId(user.teacherId);
        setLeaveRequests(response.data);
        console.log('Danh sách đơn nghỉ học:', response.data);
      } catch (error) {
        console.error('Lỗi lấy danh sách đơn nghỉ học:', error);
      }
    };
    fetchLeaveRequests();
  }, []);

  return (
    <Menu active="leave-request">
      <Toaster toastOptions={{ duration: 2200 }} />
      <div className="p-4">
        <div className="rounded shadow bg-white ">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i class="fa-solid fa-bell mr-2"></i>ĐƠN XIN NGHĨ HỌC
            </h2>
          </div>
          <div>
            {/* phần button chuyển trang */}
            <div className="flex space-x-4 my-4 justify-center">
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setFilterStatus('all');
                  setShowTeacherLeaveRequests(true);
                  setShowFullInfoLeaveRequestSent(false);
                }}
              >
                Tất cả
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setFilterStatus('approved');
                  setShowFullInfoLeaveRequestSent(false);
                  setShowTeacherLeaveRequests(true);
                }}
              >
                Đã duyệt
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setFilterStatus('pending');
                  setShowFullInfoLeaveRequestSent(false);
                  setShowTeacherLeaveRequests(true);
                }}
              >
                Chờ duyệt
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setFilterStatus('rejected');
                  setShowFullInfoLeaveRequestSent(false);
                  setShowTeacherLeaveRequests(true);
                }}
              >
                Từ chối
              </button>
            </div>

            {/* Hiển thị các đơn xin nghỉ học */}
            <div className="bg-gray-100 p-4 rounded-md border shadow-sm">
              {filteredRequests.length === 0 ? (
                <p className="text-center text-gray-600">Hiện không có đơn xin nghỉ học nào.</p>
              ) : (
                filteredRequests
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sắp xếp theo created_at giảm dần
                  .map((request) => (
                    <div key={request._id} className="p-1 ">
                      {showTeacherLeaveRequests && (
                        <div className="max-w-4xl mx-auto bg-white border shadow-md rounded-lg p-6">
                          {/* Nội dung sơ lược */}
                          <h3 className="text-center text-xl font-bold mb-4">Đơn xin nghỉ học</h3>

                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-semibold text-gray-700">Từ ngày:</span>{' '}
                              {new Date(request.start_date).toLocaleDateString()}
                              <span className="ml-4 font-semibold text-gray-700">Đến ngày:</span>{' '}
                              {new Date(request.end_date).toLocaleDateString()}
                            </div>
                            <div>
                              <span
                                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                                  request.status === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : request.status === 'approved'
                                      ? 'bg-green-500 text-white'
                                      : 'bg-red-500 text-white'
                                }`}
                                style={{ minWidth: '80px' }}
                              >
                                {request.status === 'pending'
                                  ? 'Chờ duyệt'
                                  : request.status === 'approved'
                                    ? 'Đã duyệt'
                                    : 'Bị từ chối'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-gray-700">Học sinh xin nghĩ:</span>{' '}
                            <b className="text-green-600">{request.student_name}</b>
                          </div>

                          <div className="mt-2">
                            <p>
                              <span className="font-semibold text-gray-700">Lý do :</span> {request.reason}
                            </p>
                            <div className="mt-2">
                              <span className="font-semibold text-gray-700">Danh sách buổi nghỉ:</span>
                              <ul className="list-disc list-inside ml-4">
                                {request.sessions.map((session) => (
                                  <li key={session._id}>
                                    {new Date(session.date).toLocaleDateString('en-GB')}: {session.morning && 'Sáng'}{' '}
                                    {session.afternoon && 'Chiều'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                              onClick={() => {
                                setSelectedLeaveRequest(request);
                                setShowFullInfoLeaveRequestSent(true);
                                setShowTeacherLeaveRequests(false);
                              }}
                            >
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Hiển thị nội dung chi tiết khi showFullInfoLeaveRequestSent là true */}
                      {showFullInfoLeaveRequestSent &&
                        selectedLeaveRequest &&
                        selectedLeaveRequest._id === request._id && (
                          <div
                            key={request._id + 'detail'}
                            className="max-w-md mx-auto border bg-white shadow-md rounded-lg p-4 mt-6"
                          >
                            <div className="flex items-center mb-4 justify-between">
                              <button
                                onClick={() => {
                                  setShowFullInfoLeaveRequestSent(false);
                                  setShowTeacherLeaveRequests(true);
                                }}
                                className="mr-2"
                              >
                                <i className="fas fa-arrow-left text-blue-500"></i>
                              </button>
                              <h1 className="text-center text-blue-600 text-xl font-bold mx-auto">
                                ĐƠN XIN PHÉP NGHỈ HỌC
                              </h1>
                            </div>
                            {/*
                              <div className="mb-4">
                                <h2 className="text-lg font-semibold">Người làm đơn</h2>
                                <p>Tên phụ huynh: Nguyễn Văn B</p>
                                <p>Phụ huynh của học sinh: Nguyễn Ánh Ngọc</p>
                                <p>Lớp: 1A3</p>
                              </div> */}
                            <div className="mb-4">
                              <h2 className="text-lg font-semibold">Người làm đơn</h2>
                              <p>Tên phụ huynh: {selectedLeaveRequest?.parent_name || 'Chưa có thông tin'}</p>

                              <p>
                                Phụ huynh của học sinh:
                                {selectedLeaveRequest?.student_name || 'Chưa có thông tin'}
                              </p>

                              <p>Lớp: {selectedLeaveRequest?.class_name || 'Chưa có thông tin'}</p>
                            </div>

                            <div className="mb-4">
                              <h2 className="text-lg font-semibold">Thời gian nghỉ</h2>
                              <ul className="list-disc list-inside">
                                {selectedLeaveRequest.sessions.map((session) => (
                                  <li key={session._id}>
                                    {new Date(session.date).toLocaleDateString('en-GB')}: {session.morning && 'Sáng'}{' '}
                                    {session.afternoon && 'Chiều'}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mb-4">
                              <h2 className="text-lg font-semibold">Lý do :</h2>
                              <p>{selectedLeaveRequest.reason}</p>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                              {selectedLeaveRequest.status === 'pending' ? (
                                <>
                                  <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                      handleUpdateLeaveRequest(selectedLeaveRequest._id, 'approved');
                                      // khi mà có đƠn xin nghĩ học thì gọi lại sự kiện createAttendance dể cập cập nhật danh sách điểm danh bạn đó
                                      createAttendanceByLeaveRequest(selectedLeaveRequest, 'approved');
                                    }}
                                  >
                                    Đồng ý
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                      handleUpdateLeaveRequest(selectedLeaveRequest._id, 'rejected');
                                      createAttendanceByLeaveRequest(selectedLeaveRequest, 'approved');
                                    }}
                                  >
                                    Từ chối
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setShowFullInfoLeaveRequestSent(false);
                                    setShowTeacherLeaveRequests(true);
                                  }}
                                  className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                  Trở về
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}
