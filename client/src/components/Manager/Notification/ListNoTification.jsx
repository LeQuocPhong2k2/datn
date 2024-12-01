import 'flowbite';
import React, { useState, useEffect } from 'react';
import { getAllNotifications, updateNotification, deleteNotification } from '../../../api/Notifications';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster, toast } from 'react-hot-toast';
Modal.setAppElement('#root');

export default function ListNotification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getAllNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleEditClick = (notification) => {
    setSelectedNotification(notification);
    setModalIsOpen(true);
  };
  const handleDeleteClick = async (notification) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này không?')) {
      try {
        await toast.promise(
          (async () => {
            await deleteNotification(notification._id);
          })(),
          {
            loading: 'Đang xóa...',
            success: 'Xóa thông báo thành công!',
            error: 'Xóa thông báo thất bại!',
          },
          {
            style: {
              minWidth: '250px',
            },
          }
        );
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const handleUpdateNotification = async () => {
    try {
      await updateNotification(selectedNotification._id, selectedNotification);
      setModalIsOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  return (
    <div className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
      <Toaster />
      <h4 className="text-2xl font-bold mb-4">Danh sách thông báo </h4>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Tiêu đề</th>
            <th className="py-2 px-4 border-b">Nội dung</th>
            <th className="py-2 px-4 border-b">Thời gian</th>
            <th className="py-2 px-4 border-b">Liên kết</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{notification.content.subject}</td>
              <td className="py-2 px-4 border-b">{notification.content.text}</td>

              <td className="py-2 px-4 border-b">{new Date(notification.notification_time).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <b className="text-blue-500">
                  <a href="{notification.content.link}"> Link</a>
                </b>
              </td>
              <td className="py-2 px-4 border-b flex justify-center space-x-2">
                <button
                  onClick={() => handleEditClick(notification)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDeleteClick(notification)}
                  className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedNotification && (
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
          <div
            className="grid grid-flow-row gap-4 p-4 px-10 max-h-full relative mx-auto"
            style={{ marginLeft: '200px' }}
          >
            <h4 className="text-2xl font-bold mb-4">Chỉnh sửa thông báo</h4>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Tiêu đề</label>
              <input
                type="text"
                value={selectedNotification.content.subject}
                onChange={(e) =>
                  setSelectedNotification({
                    ...selectedNotification,
                    content: { ...selectedNotification.content, subject: e.target.value },
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung</label>
              <textarea
                value={selectedNotification.content.text}
                onChange={(e) =>
                  setSelectedNotification({
                    ...selectedNotification,
                    content: { ...selectedNotification.content, text: e.target.value },
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="5"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Thời gian</label>
              <DatePicker
                selected={new Date(selectedNotification.notification_time)}
                onChange={(date) => setSelectedNotification({ ...selectedNotification, notification_time: date })}
                showTimeSelect
                dateFormat="Pp"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Liên kết</label>
              <input
                type="text"
                value={selectedNotification.content.link}
                onChange={(e) =>
                  setSelectedNotification({
                    ...selectedNotification,
                    content: { ...selectedNotification.content, link: e.target.value },
                  })
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleUpdateNotification}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Cập nhật
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
