import 'flowbite';
import React, { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';
import { IoMdCheckboxOutline } from 'react-icons/io';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
Modal.setAppElement('#root');

export default function AddNotification() {
  const [subject, setSubject] = useState(''); // Thêm state cho subject
  const [text, setText] = useState(''); // Thêm state cho text
  const [sender, setSender] = useState(''); // Thêm state cho người gửi
  const [receiver, setReceiver] = useState(''); // Thêm state cho người nhận
  const [imageUrl, setImageUrl] = useState(''); // Thêm state cho imageUrl
  const [link, setlink] = useState(''); // Thêm state cho link
  // ... existing code ...
  const [dateTime, setDateTime] = useState(new Date()); // Khởi tạo dateTime với giá trị mặc định là ngày hiện tại

  const handleAddNotification = () => {
    toast.success(`Thông báo "${subject}" đã được thêm! với nội dung: ${text}`);
  };

  return (
    <div className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
      <Toaster />

      <div className="bg-white shadow-md rounded p-6">
        <div className="text-2xl font-bold text-center mb-4" style={{ color: '#0B6FA1' }}>
          Tạo thông báo
        </div>
        <div className="mb-4 flex justify-between">
          <div className="w-1/2 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="from">
              Người gửi
            </label>
            <input
              type="text"
              name="from"
              value={sender}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="replyTo">
              Người nhận
            </label>
            <input
              type="text"
              name="replyTo"
              onChange={(e) => setReceiver(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Tiêu Đề
          </label>
          <input
            type="text"
            name="subject"
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Nhập tiêu đề Thông Báo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
            Nội Dung
          </label>
          <textarea
            name="content"
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập nội dung thông báo."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="5"
          />
        </div>

        <div className="mb-4 flex justify-between">
          <div className="w-1/2 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">
              Link liên kết (Nếu có)
            </label>
            <input
              type="text"
              name="link"
              value={link}
              onChange={(e) => setlink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="datetime">
              Thời gian thông báo
            </label>
            <DatePicker
              minDate={new Date()}
              onChange={(date) => setDateTime(date)}
              dateFormat="dd/MM/yyyy HH:mm:ss" // Định dạng hiển thị bao gồm giờ
              placeholderText="DD/MM/YYYY HH:mm:ss" // Placeholder hiển thị bao gồm giờ
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              showIcon={true} // Hiển thị icon
              selected={dateTime} // Đảm bảo rằng ngày đã chọn được hiển thị trong input
              showTimeSelect // Hiển thị giờ
              timeIntervals={15} // Khoảng thời gian giữa các giờ
              showTimeInput // Cho phép chọn giờ
              wrapperClassName="w-full" // Thêm lớp w-full vào wrapper của DatePicker
              inputProps={{ style: { paddingBottom: '10px' } }} // Thêm style cho input
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Chọn Hình Ảnh
          </label>
          <input
            type="file"
            name="image"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setImageUrl(e.target.result); // Sử dụng setImageUrl thay vì this.setState
                reader.readAsDataURL(file);
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
          />

          {imageUrl && <img src={imageUrl} alt="Selected Image" className="mt-2 w-1/2 h-auto" />}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleAddNotification}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Tạo Thông Báo
          </button>
          <button
            onClick={() => {
              setImageUrl(null);
              setSubject('');
              setText('');
              setSender('');
              setlink('');
              setReceiver('');
              setDateTime(new Date());
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
