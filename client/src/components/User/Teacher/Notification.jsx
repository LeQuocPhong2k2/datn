import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import {
  getAllNotifications,
  getNotificationsByReceiverId,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsBySenderId,
} from '../../../api/Notifications';
import Menu from './Menu';
import io from 'socket.io-client';
import { getClassByTeacherId } from '../../../api/Class';
import { Toaster, toast } from 'react-hot-toast';
export default function Notification() {
  const [showContent1, setShowContent1] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'send'
  // gọi tới api get all notifications
  const [notifications, setNotifications] = useState([]);
  const socket = useRef(null);
  const URL = process.env.REACT_APP_SOCKET_URL;
  // lấy_id của teacherId từ local storage
  const teacherId = sessionStorage.getItem('teacherId');
  console.log('teacherId:', teacherId);

  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [editNotificationId, setEditNotificationId] = useState(null);

  // sự kiện cho tab gửi
  // thêm usestate người nhận lấy từ studentList trong Api
  const [receiver, setReceiver] = useState([]);
  // Add this with other state declarations
  const [selectedReceiver, setSelectedReceiver] = useState('');
  // Add new state for sent notifications
  const [sentNotifications, setSentNotifications] = useState([]);

  useEffect(() => {
    if (!teacherId) return; // Don't make API call if teacherId is null/undefined

    if (teacherId) {
      getClassByTeacherId(teacherId).then((res) => {
        console.log('Class là :', res);
        setReceiver(res[0].studentList || []);
      });
    }
  }, [teacherId]);

  // conssole.log của receiver để kiểm tra mỗi khi thay đổi
  useEffect(() => {
    console.log('receiver:', receiver);
  }, [receiver]);

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
  }, [URL, teacherId]);

  useEffect(() => {
    if (teacherId) {
      getNotificationsBySenderId(teacherId).then((res) => {
        console.log('Sent Notifications:', res.data);
        setSentNotifications(res.data);
      });
    }
  }, [teacherId]);

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
  // // sự kiện thêm thông báo
  const handleAddNotification = async () => {
    try {
      if (!selectedReceiver) {
        alert('Vui lòng chọn ng��ời nhận');
        return;
      }

      let imageBase64 = null;
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }
      dateTime.setHours(dateTime.getHours() + 7);
      const response = await createNotification(
        teacherId,
        [selectedReceiver], // Send to selected student
        {
          subject,
          text,
          link,
          imageBase64,
        },
        dateTime
      );
      console.log('Notification created:', response);
      toast.success('Thông báo đã được gửi thành công');
      setNotifications((prev) => [response.data, ...prev]);
      setSentNotifications((prev) => [response.data, ...prev]);
      handleReset();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleEditNotification = async () => {
    try {
      const updatedNotification = {
        subject,
        text,
        link,
        image: imageUrl,
        notification_time: dateTime,
      };
      const response = await updateNotification(editNotificationId, updatedNotification);
      setNotifications((prev) =>
        prev.map((notification) => (notification._id === editNotificationId ? response.data : notification))
      );
      setSentNotifications((prev) =>
        prev.map((notification) => (notification._id === editNotificationId ? response.data : notification))
      );
      toast.success('Thông báo đã được cập nhật thành công');
      handleReset();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((notification) => notification._id !== id));
      setSentNotifications((prev) => prev.filter((notification) => notification._id !== id));
      toast.success('Thông báo đã được xóa thành công');
      // cập nhật lại table thông báo đã gửi
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleReset = () => {
    setSubject('');
    setText('');
    setLink('');
    setImageUrl('');
    setDateTime(new Date());
    setIsEditing(false);
    setEditNotificationId(null);
    setSelectedReceiver('');
  };

  const handleEditClick = (notification) => {
    setSubject(notification.content.subject);
    setText(notification.content.text);
    setLink(notification.content.link);
    setImageUrl(notification.content.image);
    setDateTime(new Date(notification.notification_time));
    setIsEditing(true);
    setEditNotificationId(notification._id);
  };

  // gọi tới api get all notifications

  useEffect(() => {
    getAllNotifications().then((res) => {
      console.log('Notifications:', res.data);
      setNotifications(res.data);
    });
  }, []);

  return (
    <Menu active="notification">
      <Toaster />
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
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(notification)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notification._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </div>
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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Người nhận</label>
                  {/* <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {receiver &&
                      receiver.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.userName}
                        </option>
                      ))}
                  </select> */}
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedReceiver}
                    onChange={(e) => setSelectedReceiver(e.target.value)}
                  >
                    <option value="">Chọn người nhận</option>
                    {receiver &&
                      receiver.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.userName}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                  <textarea
                    rows="4"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link đính kèm (nếu có)</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh đính kèm</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setImageUrl(e.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mt-1 block w-full"
                  />
                  {imageUrl && <img src={imageUrl} alt="Selected" className="mt-2 w-1/4 h-auto" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thời gian thông báo</label>
                  <DatePicker
                    minDate={new Date()}
                    onChange={(date) => setDateTime(date)}
                    dateFormat="dd/MM/yyyy HH:mm:ss"
                    placeholderText="DD/MM/YYYY HH:mm:ss"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    showTimeSelect
                    timeIntervals={15}
                    selected={dateTime}
                  />
                </div>
                <button
                  type="button"
                  onClick={isEditing ? handleEditNotification : handleAddNotification}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Cập nhật Thông Báo' : 'Gửi Thông Báo'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-2"
                  >
                    Hủy
                  </button>
                )}
              </form>

              {/* Add table of sent notifications */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Danh sách thông báo đã gửi</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiêu đề
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nội dung
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Người nhận
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sentNotifications.map((notification) => (
                        <tr key={notification._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDateTime(notification.notification_time)}
                          </td>
                          <td className="px-6 py-4">{notification.content.subject}</td>
                          <td className="px-6 py-4">
                            {notification.content.text.length > 50
                              ? `${notification.content.text.substring(0, 50)}...`
                              : notification.content.text}
                          </td>
                          <td className="px-6 py-4">
                            {/* Map through receiver_ids and display usernames */}
                            {receiver
                              .filter((student) => notification.receiver_ids.includes(student._id))
                              .map((student) => student.userName)
                              .join(', ')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleEditClick(notification)}
                              className="text-yellow-600 hover:text-yellow-900 mr-3"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
                                  handleDeleteNotification(notification._id);
                                }
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
