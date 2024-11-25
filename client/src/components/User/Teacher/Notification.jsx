import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';

import Menu from './Menu';

export default function Notification() {
  const senderName = 'Admin01';
  const createdAt = '2024-09-07T00:00:00.000Z';
  const createdAt1 = '2023-12-24T00:00:00.000Z';
  const [showContent, setShowContent] = useState(false);
  const [showContent1, setShowContent1] = useState(false);
  const content = {
    text: 'Nhân dịp Lễ Giáng Sinh 2023 Chúc các thầy cô và các em học sinh có một kỳ nghỉ lễ vui vẻ và hạnh phúc bên gia đình và người thân. Chúc các em học sinh sẽ có một kỳ học mới đầy nhiệt huyết và hứng khởi. Merry Christmas and Happy New Year 2024!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLAlmZuyO7OQx5a9lyBLhl_t1gwimPhrMhw&s',
  };
  const content1 = {
    // hãy viết text về họp phụ huynh
    text: ' Kính mời quý phụ huynh tham dự buổi họp phụ huynh học sinh vào lúc 7h30 ngày 10/10/2024 tại trường Tiểu học Nguyễn Bỉnh Khiêm. Đây là cơ hội để quý phụ huynh gặp gỡ và trò chuyện với giáo viên, cũng như nhận thông tin về quá trình học tập của con em mình. Hẹn gặp lại quý phụ huynh!',
    link: 'https://www.youtube.com/watch?v=4YBGRGBj7_w',
    image:
      'https://www.canva.com/design/DAGTWH_JYfw/_ZLoUqEYAJgTzgSi6WQ3wQ/view?utm_content=DAGTWH_JYfw&utm_campaign=designshare&utm_medium=link&utm_source=editor',
  };

  return (
    <Menu active="notification">
      <div className="p-4">
        <div className="rounded shadow bg-white ">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i class="fa-solid fa-bell mr-2"></i>THÔNG BÁO
            </h2>
          </div>
          <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Người gửi: </strong>

                  {senderName}
                </div>
                <div>
                  <strong>Thời gian: </strong>
                  {new Date(createdAt).toLocaleString()} {/* Thay createdAt bằng thời gian gửi */}
                </div>
              </div>
              <h3
                className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                onClick={() => setShowContent1(!showContent1)}
              >
                Thông báo họp phụ huynh {/* Tiêu đề thông báo */}
              </h3>
              {showContent1 && ( // Hiển thị nội dung khi nhấp vào tiêu đề
                <div className="mt-2">
                  <p>{content1.text}</p> {/* Nội dung thông báo */}
                  {content1.image && (
                    <div className="mt-2 flex justify-center">
                      <img src={content1.image} alt="Thông báo" className="w-200 h-200 object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong>Người gửi: </strong>

                  {senderName}
                </div>
                <div>
                  <strong>Thời gian: </strong>
                  {new Date(createdAt1).toLocaleString()} {/* Thay createdAt bằng thời gian gửi */}
                </div>
              </div>
              <h3
                className="text-lg font-semibold mt-2 cursor-pointer text-blue-500"
                onClick={() => setShowContent(!showContent)}
              >
                Chúc mừng lễ Giáng Sinh 2023 {/* Tiêu đề thông báo */}
              </h3>
              {showContent && ( // Hiển thị nội dung khi nhấp vào tiêu đề
                <div className="mt-2">
                  <p>{content.text}</p> {/* Nội dung thông báo */}
                  {content.link && (
                    <a href={content.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      Xem thêm
                    </a>
                  )}
                  {content.image && (
                    <div className="mt-2 flex justify-center">
                      <img src={content.image} alt="Thông báo" className="w-200 h-200 object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}
