import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

import { CiImport } from 'react-icons/ci';
import { FiEdit } from 'react-icons/fi';

import * as XLSX from 'xlsx';

import { getSubjectByGrade } from '../../../api/Subject';
import {
  getTranscriptBySubjectAndClassAndSchoolYear,
  updateTranscript,
  checkImportTranscript,
} from '../../../api/Transcripts';
import { getClassTeacherBySchoolYear, getSubjectOfTeacher, getTeacherBySubjectAndClass } from '../../../api/Schedules';
import { checkHomeRoomTeacher } from '../../../api/Class';

import Menu from './Menu';

export default function InputScore() {
  const { user } = useContext(UserContext);
  const [subjectOfSchedule, setSubjectOfSchedule] = useState([]);
  const [activeEditSubject, setActiveEditSubject] = useState(true);
  const [activeImport, setActiveImport] = useState(false);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [order, setOrder] = useState('ASC');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [transcriptBk, setTranscriptBk] = useState([]);
  const [transcriptFileUpload, setTranscriptFileUpload] = useState([]);
  const [className, setClassName] = useState('');
  const [teacherBM, setTeacherBM] = useState('');

  const [processing, setProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isEditingGK1, setIsEditingGK1] = useState(false);
  const [isEditingCK1, setIsEditingCK1] = useState(false);
  const [isEditingGK2, setIsEditingGK2] = useState(false);
  const [isEditingCK2, setIsEditingCK2] = useState(false);
  const [activeShowImport, setActiveShowImport] = useState(false);
  const [listClassNames, setListClassNames] = useState([]);
  const [listStudentImportFailed, setListStudentImportFailed] = useState([]);

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

  useEffect(() => {
    getClassTeacherBySchoolYear(user.teacherId, getCurrentSchoolYear())
      .then((data) => {
        setListClassNames(data.classNames);
      })
      .catch((error) => {
        console.error('Get class teacher by school year error:', error.response ? error.response.data : error.message);
        throw error;
      });
  }, [user.teacherId]);

  useEffect(() => {
    const phoneTeacher = sessionStorage.getItem('phoneNumberTeacher');
    checkHomeRoomTeacher(phoneTeacher, getCurrentSchoolYear(), className)
      .then((res) => {
        const grade = className[0];
        getSubjectByGrade(grade)
          .then((res) => setSubjectList(res))
          .catch((error) =>
            console.error('Get subject by grade error:', error.response ? error.response.data : error.message)
          );
      })
      .catch((error) => {
        getSubjectOfTeacher(user.teacherId, getCurrentSchoolYear(), className)
          .then((res) => {
            setSubjectList(res.subjects);
          })
          .catch((error) =>
            console.error('Get subject of teacher error:', error.response ? error.response.data : error.message)
          );
      });

    getSubjectOfTeacher(user.teacherId, getCurrentSchoolYear(), className)
      .then((res) => {
        setSubjectOfSchedule(res.subjects);
      })
      .catch((error) =>
        console.error('Get subject of teacher error:', error.response ? error.response.data : error.message)
      );
  }, [className, user.teacherId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolYear = getCurrentSchoolYear();
        const grade = className[0];

        const [transcriptRes, teacherRes] = await Promise.all([
          getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade),
          getTeacherBySubjectAndClass(subjectCode, className, schoolYear),
        ]);

        setTranscript(transcriptRes.data);
        setTranscriptBk(transcriptRes.data);
        setTeacherBM(teacherRes.teacher);
      } catch (error) {
        setTranscript([]);
        setTranscriptBk([]);
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, [subjectCode, className]);

  useEffect(() => {
    setImportProgress(0);
    setSuccess(0);
    setFailed(0);

    const isSubjectExist = subjectOfSchedule.some((subject) => subject.subjectCode === subjectCode);
    if (isSubjectExist) {
      setActiveEditSubject(false);
    } else {
      setActiveEditSubject(true);
    }
  }, [subjectCode, subjectOfSchedule]);

  /**
   * handle file upload
   * @param {*} event
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setTranscriptFileUpload([]);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setTranscriptFileUpload(worksheet);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCheckImportTranscript = async () => {
    if (className === '') {
      toast.error('Please select a classroom');
      return;
    }
    if (subjectCode === '') {
      toast.error('Please select a subject');
      return;
    }

    if (selectedSemester === '') {
      toast.error('Please select semester ');
      return;
    }

    if (selectedSemesterNumber === '') {
      toast.error('Please select semester ');
      return;
    }

    if (transcriptFileUpload.length === 0) {
      toast.error('No data found in the file');
      return;
    }

    let nfailed = 0;
    let nsuccess = 0;
    setImportProgress(0);
    setActiveImport(true);
    setListStudentImportFailed([]);
    let transcriptCheck = [];
    let mshsImportFile = [];
    const totalFile = transcriptFileUpload.length;

    const promises = transcriptFileUpload.map(async (transcriptImport, index) => {
      const dataRow = {};
      dataRow.stt = index;
      dataRow.mshs = transcriptImport['Mã số học sinh'];
      dataRow.className = className;
      dataRow.schoolYear = getCurrentSchoolYear();
      dataRow.subjectCode = subjectCode;
      const studentTranscript = transcript.find((item) => item.studentCode === dataRow.mshs);
      dataRow.userName = studentTranscript.userName;
      dataRow.dateOfBirth = studentTranscript.dateOfBirth;
      dataRow.studentCode = studentTranscript.studentCode;

      if (selectedSemesterNumber === 'Gk' && selectedSemester === '1') {
        dataRow.hk1Gk = transcriptImport['Điểm'];
        dataRow.hk1Ck = studentTranscript.hk1Ck;
        dataRow.hk1Tb = studentTranscript.hk1Tb;
        dataRow.hk2Gk = studentTranscript.hk2Gk;
        dataRow.hk2Ck = studentTranscript.hk2Ck;
        dataRow.hk2Tb = studentTranscript.hk2Tb;
        dataRow.allYear = studentTranscript.allYear;
        dataRow.remarks = studentTranscript.remarks;
        dataRow.typeScore = 'Gk1';
      }
      if (selectedSemesterNumber === 'Ck' && selectedSemester === '1') {
        dataRow.hk1Gk = studentTranscript.hk1Gk;
        dataRow.hk1Ck = transcriptImport['Điểm'];
        dataRow.tbhk1 = studentTranscript.hk1Tb;
        dataRow.hk2Gk = studentTranscript.hk2Gk;
        dataRow.hk2Ck = studentTranscript.hk2Ck;
        dataRow.hk2Tb = studentTranscript.hk2Tb;
        dataRow.allYear = studentTranscript.allYear;
        dataRow.remarks = studentTranscript.remarks;
        dataRow.typeScore = 'Ck1';
      }
      if (selectedSemesterNumber === 'Gk' && selectedSemester === '2') {
        dataRow.hk1Gk = studentTranscript.hk1Gk;
        dataRow.hk1Ck = studentTranscript.hk1Ck;
        dataRow.hk1Tb = studentTranscript.hk1Tb;
        dataRow.hk2Gk = transcriptImport['Điểm'];
        dataRow.hk2Ck = studentTranscript.hk2Ck;
        dataRow.hk2Tb = studentTranscript.hk2Tb;
        dataRow.allYear = studentTranscript.allYear;
        dataRow.remarks = studentTranscript.remarks;
        dataRow.typeScore = 'Gk2';
      }
      if (selectedSemesterNumber === 'Ck' && selectedSemester === '2') {
        dataRow.hk1Gk = studentTranscript.hk1Gk;
        dataRow.hk1Ck = studentTranscript.hk1Ck;
        dataRow.hk1Tb = studentTranscript.hk1Tb;
        dataRow.hk2Gk = studentTranscript.hk2Gk;
        dataRow.hk2Ck = transcriptImport['Điểm'];
        dataRow.hk2Tb = studentTranscript.hk2Tb;
        dataRow.allYear = studentTranscript.allYear;
        dataRow.remarks = studentTranscript.remarks;
        dataRow.typeScore = 'Ck2';
      }
      transcriptCheck.push(dataRow);

      try {
        await checkImportTranscript(dataRow);
        nsuccess++;
      } catch (error) {
        nfailed++;
        mshsImportFile.push(dataRow.mshs);
      }
      setImportProgress(Math.round(((index + 1) / totalFile) * 100));
    });

    await Promise.all(promises);

    setImportProgress(100);
    setSuccess(nsuccess);
    setFailed(nfailed);
    setListStudentImportFailed(mshsImportFile);
    setTranscript(transcriptCheck);
    setTranscriptFileUpload([]);
    document.getElementById('inputFile').value = '';
    setIsSaved(false);
  };

  const handleCancelEdit = () => {
    setTranscript(transcriptBk);
    setIsSaved(true);
    setIsEditingGK1(false);
    setIsEditingCK1(false);
    setIsEditingGK2(false);
    setIsEditingCK2(false);
  };

  const handleOnChangeEdit = (e, typeScore, index) => {
    const newTranscript = JSON.parse(JSON.stringify(transcript));
    newTranscript[index][typeScore] = e.target.value;
    setTranscript(newTranscript);
    setIsSaved(false);
  };

  const handleCheckDiemSo = () => {
    for (let i = 0; i < transcript.length; i++) {
      if (
        (isNaN(transcript[i].hk1Gk) && transcript[i].hk1Gk !== '') ||
        (isNaN(transcript[i].hk1Ck) && transcript[i].hk1Ck !== '') ||
        (isNaN(transcript[i].hk2Gk) && transcript[i].hk2Gk !== '') ||
        (isNaN(transcript[i].hk2Ck) && transcript[i].hk2Ck !== '')
      ) {
        return false;
      }

      if ((parseFloat(transcript[i].hk1Gk) < 0 || parseFloat(transcript[i].hk1Gk) > 10) && transcript[i].hk1Gk !== '') {
        return false;
      }

      if ((parseFloat(transcript[i].hk1Ck) < 0 || parseFloat(transcript[i].hk1Ck) > 10) && transcript[i].hk1Ck !== '') {
        return false;
      }

      if ((parseFloat(transcript[i].hk2Gk) < 0 || parseFloat(transcript[i].hk2Gk) > 10) && transcript[i].hk2Gk !== '') {
        return false;
      }

      if ((parseFloat(transcript[i].hk2Ck) < 0 || parseFloat(transcript[i].hk2Ck) > 10) && transcript[i].hk2Ck !== '') {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    try {
      if (!handleCheckDiemSo()) {
        Swal.fire({
          title: 'Vui lòng cập nhật điếm số hợp lệ!',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
        });
        setProcessing(false);
        return;
      }

      const promises = transcript.map((item, index) => {
        const dataRow = {
          stt: index,
          mshs: item.studentCode,
          className: className,
          schoolYear: getCurrentSchoolYear(),
          subjectCode: subjectCode,
          gk1: item.hk1Gk,
          ck1: item.hk1Ck,
          tbhk1: item.hk1Tb,
          gk2: item.hk2Gk,
          ck2: item.hk2Ck,
          tbhk2: item.hk2Tb,
          tbcn: item.allYear,
          remarks: item.remarks,
        };
        return updateTranscript(dataRow);
      });
      setProcessing(true);
      await Promise.all(promises);

      const schoolYear = getCurrentSchoolYear();
      const grade = className[0];
      getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade)
        .then((res) => {
          setTranscript(res.data);
          setTranscriptBk(res.data);
        })
        .catch((error) => {
          setTranscript([]);
          console.error(
            'Get student list by class and academic year error:',
            error.response ? error.response.data : error.message
          );
        });
      resetEditingState();
      toast.success('Cập nhật điểm thành công');
    } catch (error) {
      handleSaveError(error);
    }
  };
  const resetEditingState = () => {
    setIsEditingGK1(false);
    setIsEditingCK1(false);
    setIsEditingGK2(false);
    setIsEditingCK2(false);
    setIsSaved(true);
    setListStudentImportFailed([]);
    setProcessing(false);
  };
  const refreshTranscriptData = async () => {
    const schoolYear = getCurrentSchoolYear();
    const grade = className[0];

    try {
      const res = await getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade);
      setTranscript(res.data);
      setTranscriptBk(res.data);
    } catch (error) {
      setTranscript([]);
      console.error(
        'Get student list by class and academic year error:',
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSaveError = async (error) => {
    console.error('Error saving transcripts:', error);
    setProcessing(false);
    toast.error('Cập nhật điểm thất bại');

    // Refresh transcript data even if save fails
    await refreshTranscriptData();
  };

  const sorting = (colName) => {
    handleResetSorting();
    if (order === 'ASC') {
      if (colName === 'dateOfBirth') {
        const sortedTranscript = [...transcript].sort((a, b) => {
          const dateA = new Date(a[colName]);
          const dateB = new Date(b[colName]);
          return dateA - dateB;
        });
        setTranscript(sortedTranscript);
        setOrder('DESC');
      } else if (
        colName === 'hk1Gk' ||
        colName === 'hk1Ck' ||
        colName === 'hk1Tb' ||
        colName === 'hk2Gk' ||
        colName === 'hk2Ck' ||
        colName === 'hk2Tb' ||
        colName === 'allYear'
      ) {
        const sortedTranscript = [...transcript].sort((a, b) => {
          return parseFloat(a[colName]) - parseFloat(b[colName]);
        });
        setTranscript(sortedTranscript);
        setOrder('DESC');
      } else {
        const sortedTranscript = [...transcript].sort((a, b) => {
          const firstCompare = a[colName].localeCompare(b[colName]);
          if (firstCompare === 0) {
            return a.userName.localeCompare(b.userName);
          }
          return firstCompare;
        });
        setTranscript(sortedTranscript);
        setOrder('DESC');
      }
    }

    if (order === 'DESC') {
      if (colName === 'dateOfBirth') {
        const sortedTranscript = [...transcript].sort((a, b) => {
          const dateA = new Date(a[colName]);
          const dateB = new Date(b[colName]);
          return dateB - dateA;
        });
        setTranscript(sortedTranscript);
        setOrder('ASC');
      } else if (
        colName === 'hk1Gk' ||
        colName === 'hk1Ck' ||
        colName === 'hk1Tb' ||
        colName === 'hk2Gk' ||
        colName === 'hk2Ck' ||
        colName === 'hk2Tbh' ||
        colName === 'allYear'
      ) {
        const sortedTranscript = [...transcript].sort((a, b) => {
          return parseFloat(b[colName]) - parseFloat(a[colName]);
        });
        setTranscript(sortedTranscript);
        setOrder('ASC');
      } else {
        const sortedTranscript = [...transcript].sort((a, b) => {
          const firstCompare = b[colName].localeCompare(a[colName]);
          if (firstCompare === 0) {
            return b.userName.localeCompare(a.userName);
          }
          return firstCompare;
        });
        setTranscript(sortedTranscript);
        setOrder('ASC');
      }
    }
  };

  const handleResetSorting = () => {
    setTranscript(transcriptBk);
  };

  const handleOnchangeClass = (e) => {
    const classsBefore = className;
    const newClassName = e.target.value;

    if (!isSaved) {
      Swal.fire({
        title: 'Chưa lưu điểm, bạn có muốn chuyển lớp?',
        // text: 'Dữ liệu điểm sẽ không được lưu lại',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          setClassName(newClassName);
          setActiveShowImport(false);
          setSubjectCode('');
          setIsSaved(true);
          setIsEditingGK1(false);
          setIsEditingCK1(false);
          setIsEditingGK2(false);
          setIsEditingCK2(false);
          setListStudentImportFailed([]);
        } else {
          setClassName(classsBefore);
        }
      });
    } else {
      setClassName(e.target.value);
      setSubjectCode('');
      setTranscript([]);
      setTranscriptBk([]);
      setIsSaved(true);
      setIsEditingGK1(false);
      setIsEditingCK1(false);
      setIsEditingGK2(false);
      setIsEditingCK2(false);
    }
  };

  const handleOnchangeSubject = (e) => {
    const subjectBefore = subjectCode;
    const newSubject = e.target.value;
    if (!isSaved) {
      Swal.fire({
        title: 'Chưa lưu điểm, bạn có muốn chuyển môn học?',
        // text: 'Dữ liệu điểm sẽ không được lưu lại',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        cancelButtonText: 'Hủy',
      }).then((result) => {
        if (result.isConfirmed) {
          setSubjectCode(newSubject);
          setActiveShowImport(false);
          setIsSaved(true);
          setIsEditingGK1(false);
          setIsEditingCK1(false);
          setIsEditingGK2(false);
          setIsEditingCK2(false);
          setListStudentImportFailed([]);
        } else {
          setSubjectCode(subjectBefore);
        }
      });
    } else {
      setSubjectCode(newSubject);
      setTranscript([]);
      setTranscriptBk([]);
      setIsSaved(true);
      setIsEditingGK1(false);
      setIsEditingCK1(false);
      setIsEditingGK2(false);
      setIsEditingCK2(false);
    }
  };

  return (
    <>
      <Menu active="input-score">
        <Toaster toastOptions={{ duration: 2500 }} />
        <div className="p-4">
          <div className="rounded shadow bg-white ">
            <div className="px-4 py-2 border-b">
              <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
                <i className="fas fa-chart-bar mr-2"></i>
                QUẢN LÝ ĐIẾM SỐ
              </h2>
            </div>

            <div className="px-4 py-2 flex flex-wrap gap-4">
              <div className="w-60">
                <label className="block mb-2">
                  Lớp<span className="text-red-500">*</span>
                </label>
                <select
                  value={className}
                  onChange={(e) => {
                    handleOnchangeClass(e);
                  }}
                  className="w-full p-2 border rounded"
                  style={{ zIndex: 10 }}
                  defaultValue={''}
                >
                  <option value="">Chọn lớp</option>
                  {listClassNames.map((elm, index) => (
                    <option key={index} value={elm.className}>
                      {elm.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-60">
                <label className="block mb-2">
                  Môn học<span className="text-red-500">*</span>
                </label>
                <select
                  name="subjectCode"
                  value={subjectCode}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    handleOnchangeSubject(e);
                  }}
                  defaultValue={''}
                >
                  <option value="" selected></option>
                  {subjectList.map((subject) => (
                    <option key={subject.subjectCode} value={subject.subjectCode}>
                      {subject.subjectName}
                    </option>
                  ))}
                  {subjectList.length === 0 && <option>Chưa có môn học</option>}
                </select>
              </div>
              {teacherBM && teacherBM.userName !== user.userName && (
                <div className="w-60">
                  <label className="block mb-2">Giáo viên bộ môn</label>
                  <input
                    type="text"
                    value={teacherBM.userName}
                    className="w-full p-2 border-none rounded bg-gray-100"
                  />
                </div>
              )}

              {!isSaved && (
                <div className="w-96 flex items-end gap-2">
                  <button
                    onClick={handleSave}
                    className="h-10 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 "
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="h-10 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 "
                  >
                    Hủy bỏ thay đổi
                  </button>
                  {processing && (
                    <div role="status" className="flex items-center h-10">
                      <svg
                        aria-hidden="true"
                        class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span class="sr-only">Loading...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!activeEditSubject && (
              <div className="px-4 py-4 flex items-center justify-start gap-1">
                <input
                  type="checkbox"
                  checked={activeShowImport}
                  onChange={(e) => {
                    setActiveShowImport(e.target.checked);
                  }}
                />
                <p className="">Nhập điểm từ file Excel</p>

                <a href="/template/Diem_XXX_MonHoc_LopHoc.xlsx" className="text-blue-500" download>
                  File mẫu
                </a>
              </div>
            )}

            {activeShowImport && (
              <div className="px-4 pb-5 flex flex-wrap gap-4">
                <div className="flex flex-wrap items-end justify-start gap-4">
                  <div>
                    <label className="block mb-2">
                      Học kỳ<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-60 p-2 border rounded"
                        defaultValue={''}
                      >
                        <option value={''}></option>
                        <option value={'1'}>Học kỳ 1</option>
                        <option value={'2'}>Học kỳ 2</option>
                      </select>
                      <select
                        value={selectedSemesterNumber}
                        onChange={(e) => setSelectedSemesterNumber(e.target.value)}
                        className="w-60 p-2 border rounded"
                        defaultValue={''}
                      >
                        <option value={''}></option>
                        <option value={'Gk'}>Giữa kỳ</option>
                        <option value={'Ck'}>Cuối kỳ</option>
                      </select>
                    </div>
                  </div>
                  <div className="">
                    <input id="inputFile" type="file" onChange={handleFileUpload} className="w-full border rounded" />
                  </div>
                  <button
                    onClick={handleCheckImportTranscript}
                    type="button"
                    className="w-16 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    <CiImport className="text-xl font-medium" />
                  </button>
                </div>
                <div className="flex items-end justify-start gap-2">
                  {activeImport && (
                    <div className="grid grid-flow-col gap-5 w-96 min-w-96">
                      <span>Tiến trình: {importProgress}%</span>
                      <span>Thành công: {success}</span>
                      <span>Thất bại: {failed}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="px-4 overflow-x-auto">
              <table className="min-w-full border mb-5" style={{ userSelect: 'none', width: '100%' }}>
                <thead className=" bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 w-10 min-w-10" rowSpan={2}>
                      STT
                    </th>
                    <th onClick={() => sorting('studentCode')} className="border px-4 py-2 w-28 min-w-28" rowSpan={2}>
                      <span class="flex items-center">
                        MSHS
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                    <th
                      onClick={() => sorting('lastName')}
                      className="border px-4 py-2 w-44 min-w-44 text-left"
                      rowSpan={2}
                    >
                      <span class="flex items-center">
                        Họ và Tên
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                    <th onClick={() => sorting('dateOfBirth')} className="border px-4 py-2 w-32 min-w-32" rowSpan={2}>
                      <span class="flex items-center">
                        Ngày Sinh
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                    <th className="border px-4 py-2" colSpan={3}>
                      HKI
                    </th>
                    <th className="border px-4 py-2" colSpan={3}>
                      HKII
                    </th>
                    <th onClick={() => sorting('allYear')} className="border px-4 py-2 w-36 min-w-36" rowSpan={2}>
                      <span class="flex items-center">
                        TB Cả Năm
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                    <th className="border px-4 py-2 w-28 min-w-28 text-left" rowSpan={2}>
                      Xếp loại
                    </th>
                    {/* <th className="border px-4 py-2 w-14 min-w-14" rowSpan={2}></th>
                    <th className="border px-4 py-2 w-14 min-w-14" rowSpan={2}></th> */}
                  </tr>
                  <tr>
                    <th className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        GK
                        <svg
                          onClick={() => sorting('hk1Gk')}
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                        {!activeEditSubject && (
                          <div
                            onClick={() => {
                              setIsEditingGK1(!isEditingGK1);
                              setIsEditingCK1(false);
                              setIsEditingGK2(false);
                              setIsEditingCK2(false);
                            }}
                            className="cursor-pointer text-lg pl-4 hover:text-blue-500"
                          >
                            <FiEdit />
                          </div>
                        )}
                      </span>
                    </th>
                    <th className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        CK
                        <svg
                          onClick={() => sorting('hk1Ck')}
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                        {!activeEditSubject && (
                          <div
                            onClick={() => {
                              setIsEditingCK1(!isEditingCK1);
                              setIsEditingGK1(false);
                              setIsEditingGK2(false);
                              setIsEditingCK2(false);
                            }}
                            className="cursor-pointer text-lg pl-4 hover:text-blue-500"
                          >
                            <FiEdit />
                          </div>
                        )}
                      </span>
                    </th>
                    <th onClick={() => sorting('hk1Tb')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        TB
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                    <th className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        GK
                        <svg
                          onClick={() => sorting('hk2Gk')}
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                        {!activeEditSubject && (
                          <div
                            onClick={() => {
                              setIsEditingGK2(!isEditingGK2);
                              setIsEditingCK1(false);
                              setIsEditingGK1(false);
                              setIsEditingCK2(false);
                            }}
                            className="cursor-pointer text-lg pl-4 hover:text-blue-500"
                          >
                            <FiEdit />
                          </div>
                        )}
                      </span>
                    </th>
                    <th className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        CK
                        <svg
                          onClick={() => sorting('hk2Ck')}
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                        {!activeEditSubject && (
                          <div
                            onClick={() => {
                              setIsEditingCK2(!isEditingCK2);
                              setIsEditingGK2(false);
                              setIsEditingCK1(false);
                              setIsEditingGK1(false);
                            }}
                            className="cursor-pointer text-lg pl-4 hover:text-blue-500"
                          >
                            <FiEdit />
                          </div>
                        )}
                      </span>
                    </th>
                    <th onClick={() => sorting('hk2Tb')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        TB
                        <svg
                          className="cursor-pointer w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          />
                        </svg>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.map((student, index) => {
                    let borderCheck = 'odd:bg-white even:bg-yellow-50';
                    const check = listStudentImportFailed.find((item) => item === student.studentCode);
                    if (check) {
                      borderCheck = 'bg-red-500';
                    }

                    return (
                      <>
                        <tr className={`h-16  ${borderCheck}`} key={index}>
                          <td className="border px-4 py-2 text-center">{index + 1}</td>
                          <td className="border px-4 py-2 text-center">{student.studentCode}</td>
                          <td className="border px-4 py-2">{student.userName}</td>
                          <td className="border px-4 py-2">{student.dateOfBirth}</td>
                          <td className="border px-4 py-2 text-center">
                            {isEditingGK1 ? (
                              <input
                                value={student.hk1Gk}
                                onChange={(e) => handleOnChangeEdit(e, 'hk1Gk', index)}
                                type="number"
                                min={0}
                                max={10}
                                name="gk1"
                                className="w-16 p-1 border rounded text-center"
                              />
                            ) : (
                              <span>{student.hk1Gk}</span>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {isEditingCK1 ? (
                              <input
                                value={student.hk1Ck}
                                onChange={(e) => handleOnChangeEdit(e, 'hk1Ck', index)}
                                type="number"
                                min={0}
                                max={10}
                                name="ck1"
                                className="w-16 p-1 border rounded text-center"
                              />
                            ) : (
                              <span>{student.hk1Ck}</span>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <span>{student.hk1Tb}</span>
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {isEditingGK2 ? (
                              <input
                                value={student.hk2Gk}
                                onChange={(e) => handleOnChangeEdit(e, 'hk2Gk', index)}
                                type="number"
                                min={0}
                                max={10}
                                name="gk2"
                                className="w-16 p-1 border rounded text-center"
                              />
                            ) : (
                              <span>{student.hk2Gk}</span>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            {isEditingCK2 ? (
                              <input
                                value={student.hk2Ck}
                                onChange={(e) => handleOnChangeEdit(e, 'hk2Ck', index)}
                                type="number"
                                min={0}
                                max={10}
                                name="ck2"
                                className="w-16 p-1 border rounded text-center"
                              />
                            ) : (
                              <span>{student.hk2Ck}</span>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <span>{student.hk2Tb}</span>
                          </td>
                          <td className="border px-4 py-2 text-center">
                            <span>{student.allYear}</span>
                          </td>
                          <td className="border px-4 py-2 text-left">
                            {/* {activeEdit === index ? (
                          <input
                            value={dataRow.remarks}
                            onChange={(e) => handleOnChangeEdit(e)}
                            type="text"
                            name="remarks"
                            className="w-full p-1 border rounded text-left"
                          />
                        ) : (
                          <span>{student.remarks}</span>
                        )} */}
                          </td>
                          {/* <td className="border px-4 py-2 text-center  text-xl">
                            {activeEdit === index ? (
                              <div
                                onClick={() => handleSave()}
                                className="cursor-pointer flex items-center justify-center hover:text-blue-700"
                              >
                                <RiSave3Fill className="hover:text-green-700 text-green-500 cursor-pointer" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center hover:text-blue-700">
                                <button onClick={() => handleActiveEdit(index)} disabled={activeEditSubject}>
                                  <RiEdit2Fill
                                    className={
                                      activeEditSubject
                                        ? 'cursor-not-allowed text-gray-500 opacity-50'
                                        : 'hover:text-red-700 text-red-500 cursor-pointer'
                                    }
                                  />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="border px-4 py-2 text-center text-xl">
                            <div
                              onClick={handleCancelEdit}
                              className="flex items-center justify-center hover:text-blue-700"
                            >
                              <GrRefresh
                                className={
                                  activeEdit === index
                                    ? 'cursor-pointer hover:text-blue-700 text-blue-500'
                                    : 'cursor-not-allowed text-gray-500 opacity-50'
                                }
                              />
                            </div>
                          </td> */}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Menu>
    </>
  );
}
