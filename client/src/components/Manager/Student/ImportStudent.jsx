/* eslint-disable no-unused-vars */
import React from 'react';
import * as XLSX from 'xlsx';
import { useState } from 'react';

import { addStudent } from '../../../api/Student';

const ImportStudent = () => {
  const [studentsImportFailed, setStudentsImportFailed] = useState([]);
  const [studentsImport, setStudentsImport] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState({
    success: 0,
    failed: 0,
  });
  const [studentInfo, setStudentInfo] = useState({
    mssv: '',
    hoTen: '',
    firstName: '',
    lastName: '',
    namSinh: '',
    gioiTinh: '',
    danToc: '',
    ngayVaoTruong: '',
    sdt: '',
    diaChi: '',
    moiQuanHeKhac: false,
    moiQuanHeCha: false,
    moiQuanHeMe: false,
    hoTenCha: '',
    namSinhCha: '',
    ngheNghiepCha: '',
    sdtCha: '',
    hoTenMe: '',
    namSinhMe: '',
    ngheNghiepMe: '',
    sdtMe: '',
    moiQuanHe: '',
    hoTenNguoiGiamHo: '',
    namSinhNguoiGiamHo: '',
    ngheNghiepNguoiGiamHo: '',
    sdtNguoiGiamHo: '',
    namHoc: '',
    khoiLop: '',
    lopHoc: '',
    giaoVienChuNhiem: '',
    siSo: '',
  });

  /**
   * handleFileUpload
   * @param {*} event
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setStudentsImport(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * handleImport
   */
  const handleImport = async () => {
    let totalStudents = studentsImport.length;
    let success = 0;
    let failed = 0;
    setProgressStatus({ success, failed });
    setStudentsImportFailed([]);
    setImportProgress(0);

    for (let index = 0; index < totalStudents; index++) {
      const student = studentsImport[index];
      studentInfo.namHoc = student['Năm học'];
      studentInfo.khoiLop = student['Khối'];
      studentInfo.lopHoc = student['Lớp'];
      studentInfo.firstName = student['Họ'];
      studentInfo.lastName = student['Tên'];
      studentInfo.namSinh = student['Năm sinh'];
      studentInfo.gioiTinh = student['Giới tính'];
      studentInfo.danToc = student['Dân tộc'];
      studentInfo.ngayVaoTruong = student['Ngày vào trường'];
      studentInfo.sdt = student['Số điện thoại'];
      studentInfo.diaChi = student['Địa chỉ'];
      studentInfo.moiQuanHeKhac = student['Quan hệ khác'] === 'Không' ? false : true;
      studentInfo.moiQuanHe = student['Quan hệ khác'];
      studentInfo.moiQuanHeCha = student['Cha'] === 'Có' ? true : false;
      studentInfo.moiQuanHeMe = student['Mẹ'] === 'Có' ? true : false;
      studentInfo.hoTenCha = student['Họ tên cha'];
      studentInfo.namSinhCha = student['Năm sinh cha'];
      studentInfo.ngheNghiepCha = student['Nghề nghiệp cha'];
      studentInfo.sdtCha = student['Số điện thoại cha'];
      studentInfo.hoTenMe = student['Họ tên mẹ'];
      studentInfo.namSinhMe = student['Năm sinh mẹ'];
      studentInfo.ngheNghiepMe = student['Nghề nghiệp mẹ'];
      studentInfo.sdtMe = student['Số điện thoại mẹ'];
      studentInfo.hoTenNguoiGiamHo = student['Họ tên quan hệ khác'];
      studentInfo.namSinhNguoiGiamHo = student['Năm sinh quan hệ khác'];
      studentInfo.ngheNghiepNguoiGiamHo = student['Nghề nghiệp quan hệ khác'];
      studentInfo.sdtNguoiGiamHo = student['Số điện thoại quan hệ khác'];

      try {
        await addStudent(studentInfo);
        success++;
      } catch (error) {
        setStudentsImportFailed((studentsImportFailed) => [
          ...studentsImportFailed,
          {
            student: error.response.data.student,
            message: error.response.data.message,
          },
        ]);

        failed++;
        if (error.response.status === 401) {
          console.log('Mã số sinh viên đã tồn tại');
        }
        if (error.response.status === 402) {
          console.log(`Số điện thoại đã được đăng ký cho tên ${studentInfo.firstName} ${studentInfo.lastName}`);
        }
        if (error.response.status === 403) {
          console.log('Không tìm thấy lớp học');
        }
        if (error.response.status === 404) {
          console.log('Sỉ số lớp đã đầy');
        }
        if (error.response.status === 500) {
          console.log('Thêm học sinh thất bại');
        }
      }

      setImportProgress(Math.round(((index + 1) / totalStudents) * 100));

      setProgressStatus({ success, failed });

      console.log('studentsImportFailed', studentsImportFailed);
      console.log('ImportProgress', importProgress);
    }
  };

  return (
    <div id="root" className="grid grid-flow-row gap-2 p-4 px-10 max-h-full w-full overflow-auto relative">
      <div className="pb-5">
        <span className="text-lg font-medium flex items-center justify-start gap-1">Import hồ sơ học sinh</span>
        <span
          className="
              text-sm text-gray-500 font-normal flex items-center justify-start gap-1
            "
        >
          Trang này dùng để import hồ sơ học sinh từ file excel
        </span>
      </div>
      <div>
        <input type="file" onChange={handleFileUpload} />
        <button
          onClick={handleImport}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Import
        </button>
      </div>
      <div>
        <span>Process: {importProgress}%</span>
      </div>
      <div>
        <span>Thành công: {progressStatus.success}</span>
      </div>
      <div>
        <span>Thất bại: {progressStatus.failed}</span>
      </div>
      <div>
        <span className="font-medium text-red-500 underline underline-offset-2">Danh sách import thất bại</span>
      </div>
      <div>
        <div className="h-full overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-10">STT</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-52">Họ và tên</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-20">Lớp</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Số điện thoại</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Năm sinh</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-40">Địa chỉ</th>
                <th className="py-2 pl-2 border border-b border-gray-300 text-left w-96">Lý do import thất bại</th>
              </tr>
            </thead>
            <tbody>
              {studentsImportFailed.map((student, index) => (
                <tr key={index}>
                  <td className="py-2 pl-2 border border-b border-gray-300">{student.student && index + 1}</td>
                  <td className="py-2 pl-2 border border-b border-gray-300">
                    {student.student && student.student.firstName} {student.student && student.student.lastName}
                  </td>
                  <td className="py-2 pl-2 border border-b border-gray-300">
                    {student.student && student.student.lopHoc}
                  </td>
                  <td className="py-2 pl-2 border border-b border-gray-300">
                    {student.student && student.student.sdt}
                  </td>
                  <td className="py-2 pl-2 border border-b border-gray-300">
                    {student.student && student.student.namSinh}
                  </td>
                  <td className="py-2 pl-2 border border-b border-gray-300">
                    {student.student && student.student.diaChi}
                  </td>
                  <td className="py-2 pl-2 border border-b border-gray-300">{student.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ImportStudent;
