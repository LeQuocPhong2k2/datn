import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { getAllNotifications, getNotificationsByReceiverId } from '../../../api/Notifications';
import Menu from './Menu';
import io from 'socket.io-client';

export default function Notification() {
  const [showContent1, setShowContent1] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'send'

  // gọi tới api get all notifications
  const [notifications, setNotifications] = useState([]);
  const socket = useRef(null);
  const URL = process.env.REACT_APP_SOCKET_URL;
  // lấy_id của teacherId từ local storage
  const teacherId = localStorage.getItem('teacherId');
  console.log('teacherId:', teacherId);

  useEffect(() => {
    // getAllNotifications().then((res) => {
    //   console.log('Notifications:', res.data);
    //   setNotifications(res.data);
    // });
    getNotificationsByReceiverId(teacherId).then((res) => {
      console.log('Notifications:', res.data);
      setNotifications(res.data);
    });

    console.log('socket:', URL);

    const connectSocket = () => {
      socket.current = io(URL, {
        // Đảm bảo địa chỉ chính xác
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.current.on('connect', () => {
        console.log('Client kết nối socket thành công:', socket.current.id);
        // alert('Kết nối socket thành công');
      });

      socket.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        // alert('Kết nối socket thất bại');
      });

      socket.current.on('newNotification', (notification) => {
        console.log(' newNotification ở socket kết nối thành công:', notification);
        // const delay = new Date(notification.notification_time) - new Date();
        // if (delay > 0) {
        //   setTimeout(() => {
        //     setNotifications((prev) => [notification, ...prev]);
        //   }, delay);
        // } else {
        //   setNotifications((prev) => [notification, ...prev]);
        // }
        setNotifications((prev) => [notification, ...prev]);
      });
      // lắng nghe sự kiện getAllNotifications ở phía server socket
      socket.current.on('getAllNotifications', (notifications) => {
        console.log('getAllNotifications ở socket kết nối thành công:', notifications);
        setNotifications(notifications);
      });
    };

    connectSocket();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Thêm hàm format date
  const formatDateTime = (dateString) => {
    // Tách thời gian UTC thành các thành phần
    const date = new Date(dateString);
    const utcDay = date.getUTCDate().toString().padStart(2, '0');
    const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcYear = date.getUTCFullYear();
    const utcHour = date.getUTCHours().toString().padStart(2, '0');
    const utcMinute = date.getUTCMinutes().toString().padStart(2, '0');

    return `${utcHour}:${utcMinute} ${utcDay}/${utcMonth}/${utcYear}`;
  };

  return (
    <Menu active="notification">
      <div className="p-4">
        <div className="rounded shadow bg-white ">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i className="fa-solid fa-bell mr-2"></i>THÔNG BÁO
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === 'send' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('send')}
            >
              Gửi Thông Báo
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('view')}
            >
              Xem Thông Báo
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'view' ? (
            // Xem Thông Báo content
            <div>
              {notifications
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((notification, index) => (
                  <div key={notification._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>Người gửi: </strong>
                        {/* {notification.sender_id}  */}
                        Admin
                      </div>
                      <div>
                        <strong>Thời gian: </strong>
                        {formatDateTime(notification.notification_time)}
                      </div>
                    </div>
                    <h3
                      className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                      onClick={() => setShowContent1(index === showContent1 ? null : index)}
                    >
                      {notification.content.subject}
                    </h3>
                    {showContent1 === index && (
                      <div className="mt-2">
                        <p>{notification.content.text}</p>
                        {notification.content.image && (
                          <div className="mt-2 flex justify-center">
                            <img
                              src={notification.content.image}
                              alt="Thông báo"
                              className="w-1/2 h-auto object-cover"
                            />
                          </div>
                        )}

                        {notification.content.link && notification.content.link.trim() !== '' && (
                          <div className="mt-2 flex justify-between">
                            <b>
                              <a
                                href={notification.content.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500"
                              >
                                Link liên kết
                              </a>
                            </b>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            // Gửi Thông Báo content
            <div className="p-4">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                  <textarea
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link đính kèm (nếu có)</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh đính kèm</label>
                  <input type="file" accept="image/*" className="mt-1 block w-full" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Gửi Thông Báo
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
