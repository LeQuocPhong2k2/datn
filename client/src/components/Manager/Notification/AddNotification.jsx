import 'flowbite';
import React, { useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { Toaster, toast } from 'react-hot-toast';
import { IoMdCheckboxOutline } from 'react-icons/io';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createNotification } from '../../../api/Notifications';
import { useEffect } from 'react';
import { getAdministratorsbyAccountId } from '../../../api/Administrator';
import { getStudentListByClassNameAndAcademicYear } from '../../../api/Class';
Modal.setAppElement('#root');
export default function AddNotification() {
  // tạo 1 biến quản lý thông tin Admin
  const [admin, setAdmin] = useState({});
  // hàm lấy thông tin Admin
  const accountId = localStorage.getItem('_id');
  useEffect(() => {
    getAdministratorsbyAccountId(accountId)
      .then((res) => {
        setAdmin(res.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching administrators:', error.response ? error.response.data : error.message);
      });
  }, [accountId]);
  // sau khi lấy thông tin Admin, hiển thị thông tin Admin
  useEffect(() => {
    console.log('Thông tin Admin ở trang Noti là:', admin);
  }, [admin]);

  const [sender, setSender] = useState(''); // Thêm state cho người gửi
  // setSender là admin_id được lưu trong localStorage
  const admin_id = localStorage.getItem('admin_id');
  useEffect(() => {
    setSender(admin_id);
  }, [admin_id]);

  const [selectedReceiver, setSelectedReceiver] = useState('');
  const [listIdReceivers, setListIdReceivers] = useState([]);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  // khi mà selectedReceiver thay đổi, thì cập nhật listIdReceivers gọi tới hàm getStudentListByClassNameAndAcademicYear
  useEffect(() => {
    if (selectedReceiver && academicYear) {
      getStudentListByClassNameAndAcademicYear(selectedReceiver, academicYear)
        .then((res) => {
          console.log('Kết quả khi chạy là ', res.data);
          if (res.data.students && Array.isArray(res.data.students)) {
            setListIdReceivers(res.data.students.map((student) => student._id));
          } else {
            console.error('students not found in response data');
          }
        })
        .catch((error) => {
          console.error('Error fetching students:', error.response ? error.response.data : error.message);
        });
    }
  }, [selectedReceiver, academicYear]);

  useEffect(() => {
    console.log('List Id Receivers:', listIdReceivers);
  }, [listIdReceivers]);

  const [subject, setSubject] = useState(''); // Thêm state cho subject
  const [text, setText] = useState(''); // Thêm state cho text
  const [imageUrl, setImageUrl] = useState(''); // Thêm state cho imageUrl
  // upload ảnh lên S3 và lấy link ảnh
  const [isUploading, setIsUploading] = useState(false);

  const [link, setlink] = useState(''); // Thêm state cho link
  // ... existing code ...
  const [dateTime, setDateTime] = useState(new Date()); // Khởi tạo dateTime với giá trị mặc định là ngày hiện tại

  //update hàm mới

  const handleAddNotification = async () => {
    try {
      let imageBase64 = null;

      // Convert file to base64 if exists
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      const response = await createNotification(
        admin_id,
        listIdReceivers,
        {
          subject,
          text,
          link,
          imageBase64,
        },
        dateTime
      );

      toast.success('Tạo thông báo thành công', {
        icon: <IoMdCheckboxOutline />,
      });
      handleReset();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Tạo thông báo thất bại', {
        icon: <IoWarningOutline />,
      });
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setSubject('');
    setText('');
    setlink('');
    setSelectedReceiver('1A1');
    setDateTime(new Date());
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
              //value={sender}
              value={admin.userName}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="replyTo">
              Người nhận
            </label>
            <select
              className="w-full p-2 border rounded"
              style={{ zIndex: 10 }}
              value={selectedReceiver}
              onChange={(e) => setSelectedReceiver(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => i + 1).map((grade) =>
                Array.from({ length: 5 }, (_, j) => `A${j + 1}`).map((className) => (
                  <option key={`${grade}${className}`} value={`${grade}${className}`}>
                    {`${grade}${className}`}
                  </option>
                ))
              )}
            </select>
            {/* <p>Selected Receiver: {selectedReceiver}</p>  */}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Tiêu Đề
          </label>
          <input
            type="text"
            name="subject"
            value={subject}
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
            value={text}
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

          {imageUrl && <img src={imageUrl} alt="Selected" className="mt-2 w-1/4 h-auto" />}
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Chọn Hình Ảnh
          </label>
          <input
            type="file"
            name="image"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 leading-tight focus:outline-none focus:shadow-outline"
          />

          {isUploading && <p>Đang tải ảnh lên...</p>}
          {imageUrl && <img src={imageUrl} alt="Selected" className="mt-2 w-1/4 h-auto" />}
        </div> */}

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleAddNotification}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Tạo Thông Báo
          </button>
          <button
            onClick={() => {
              handleReset();
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Nhập lại
          </button>
        </div>
      </div>
    </div>
  );
}
