import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { getAllNotifications } from '../../../api/Notifications';
import Menu from './Menu';

export default function Notification() {
  const senderName = 'Admin01';
  const createdAt = '2024-09-07T00:00:00.000Z';
  const createdAt1 = '2023-12-24T00:00:00.000Z';
  const [showContent, setShowContent] = useState(false);
  const [showContent1, setShowContent1] = useState(false);
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'send'
  const content = {
    text: 'Nhân dịp Lễ Giáng Sinh 2023 Chúc các thầy cô và các em học sinh có một kỳ nghỉ lễ vui vẻ và hạnh phúc bên gia đình và người thân. Chúc các em học sinh sẽ có một kỳ học mới đầy nhiệt huyết và hứng khởi. Merry Christmas and Happy New Year 2024!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLAlmZuyO7OQx5a9lyBLhl_t1gwimPhrMhw&s',
  };
  const content1 = {
    // hãy viết text về họp phụ huynh
    text: ' Kính mời quý phụ huynh tham dự buổi h���p phụ huynh học sinh vào lúc 7h30 ngày 10/10/2024 tại trường Tiểu học Nguyễn Bỉnh Khiêm. Đây là cơ hội để quý phụ huynh gặp gỡ và trò chuyện với giáo viên, cũng như nhận thông tin về quá trình học tập của con em mình. Hẹn gặp lại quý phụ huynh!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image:
      'https://www.canva.com/design/DAGTWH_JYfw/_ZLoUqEYAJgTzgSi6WQ3wQ/view?utm_content=DAGTWH_JYfw&utm_campaign=designshare&utm_medium=link&utm_source=editor',
  };

  // gọi tới api get all notifications
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    getAllNotifications().then((res) => {
      console.log('Notifications:', res.data);
      setNotifications(res.data);
    });
  }, []);

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
                        {new Date(notification.created_at).toLocaleString()}
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
