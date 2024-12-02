/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { format, isValid } from 'date-fns';
import 'flowbite';
import React, { useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import { BiUser } from 'react-icons/bi';

import { getReportByClassAndDay } from '../../api/TeachingReport';
// import { get } from 'mongoose';
import toast from 'react-hot-toast';

const ViewReport = ({ studentInfor }) => {
  const [report, setReport] = useState([]);
  const isWeekday = (date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return day !== 0 && day !== 6;
  };
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() + 1);
    return yesterday;
  });
  function getNgayBaoBai() {
    const ngayHienTai = new Date();
    const ngayBaoBai = new Date(ngayHienTai);
    const thuTrongTuan = ngayHienTai.getDay();
    if (thuTrongTuan === 6) {
      const daysToNextMonday = 2;
      ngayBaoBai.setDate(ngayHienTai.getDate() + daysToNextMonday);
    } else if (thuTrongTuan === 0) {
      const daysToNextMonday = 1;
      ngayBaoBai.setDate(ngayHienTai.getDate() + daysToNextMonday);
    } else {
      ngayBaoBai.setDate(ngayHienTai.getDate() + 1);
    }
    return ngayBaoBai;
  }

  const dayOfWeek = isValid(selectedDate) ? getDay(selectedDate) : '';
  const formattedDate = isValid(selectedDate) ? format(selectedDate, 'dd/MM/yyyy') : '';
  const maxDate = getNgayBaoBai();

  const getCurrentSchoolYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (currentMonth >= 8) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };

  function getDay(ngay) {
    const ngayThu = new Date(ngay).getDay();
    const thuTiengViet = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return thuTiengViet[ngayThu];
  }

  useEffect(() => {
    const className = studentInfor.className;
    const schoolYear = getCurrentSchoolYear();
    const ngayBaoBai = getNgayBaoBai(selectedDate);
    setSelectedDate(ngayBaoBai);
    const date = format(ngayBaoBai, 'dd/MM/yyyy');
    getReportByClassAndDay(schoolYear, className, date).then((res) => {
      setReport(res.teachingReports);
    });
  }, []);

  const handleSearch = () => {
    if (!isValid(selectedDate)) {
      toast.error('Ngày báo bài không hợp lệ');
      return;
    }

    const className = studentInfor.className;
    const schoolYear = getCurrentSchoolYear();
    const date = format(selectedDate, 'dd/MM/yyyy');
    getReportByClassAndDay(schoolYear, className, date).then((res) => {
      setReport(res.teachingReports);
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 items-end justify-start gap-1 pb-5">
        <div className="flex items-end justify-start gap-1">
          <div>
            <div className="flex items-center justify-start gap-1 text-lg">
              <i class="fa-regular fa-calendar"></i>
              <span>Ngày báo bài</span>
            </div>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              filterDate={isWeekday}
              maxDate={maxDate}
              className="w-44 h-10 rounded border ring-0 outline-0 focus:ring-0 focus:border"
            />
          </div>
          <div className="flex flex-col justify-end gap-2 ">
            <button
              onClick={handleSearch}
              className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded h-10"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
        <div>
          <span className="text-xl font-bold">BÁO BÀI LỚP {studentInfor.className}</span>
          <br />
          <span>
            {dayOfWeek} - {formattedDate}
          </span>
        </div>
      </div>

      <div>
        {report.length > 0 && (
          <>
            {report.map((item, index) => (
              <div className="flex flex-col border-t py-4">
                <h2 className="text-xl font-semibold">{item.subjectName}</h2>
                <p className="font-medium">Nội dung bài mới:</p>
                <p className="pl-5">{item.content}</p>
                <p className="font-medium">Ghi chú:</p>
                <p className="pl-5">{item.note}</p>
                <p className="flex items-center justify-start gap-1 pt-2 text-sm text-gray-500">
                  <BiUser />
                  Gv.{item.teacherName}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewReport;
