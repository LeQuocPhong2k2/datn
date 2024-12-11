import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { Toaster, toast } from 'react-hot-toast';

import { RiEdit2Fill } from 'react-icons/ri';
import { RiSave3Fill } from 'react-icons/ri';
import { GrRefresh } from 'react-icons/gr';
import { CiImport } from 'react-icons/ci';

import * as XLSX from 'xlsx';

import { getSubjectByGrade } from '../../../api/Subject';
import { getTranscriptBySubjectAndClassAndSchoolYear, updateTranscript } from '../../../api/Transcripts';
import { getClassTeacherBySchoolYear, getSubjectOfTeacher } from '../../../api/Schedules';
import { checkHomeRoomTeacher } from '../../../api/Class';

import Menu from './Menu';

export default function InputScore() {
  const { user } = useContext(UserContext);
  const [subjectOfSchedule, setSubjectOfSchedule] = useState([]);
  const [activeEditSubject, setActiveEditSubject] = useState('');
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
  const [activeEdit, setActiveEdit] = useState('-1');
  const [className, setClassName] = useState('');
  const [dataRow, setDataRow] = useState({
    stt: 1,
    mshs: 1,
    className: '',
    schoolYear: '',
    subjectCode: '',
    gk1: 1,
    ck1: 1,
    tbhk1: 1,
    gk2: 1,
    ck2: 1,
    tbhk2: 1,
    tbcn: 1,
    remarks: '',
  });

  const [listClassNames, setListClassNames] = useState([]);

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
    const schoolYear = getCurrentSchoolYear();
    const grade = className[0];
    getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade)
      .then((res) => {
        setTranscript(res.data);
        setTranscriptBk(res.data);
      })
      .catch((error) => {
        setTranscript([]);
        setTranscriptBk([]);
        console.error(
          'Get student list by class and academic year error:',
          error.response ? error.response.data : error.message
        );
      });
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

  const handleImportTranscript = async () => {
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
    const totalFile = transcriptFileUpload.length;
    for (let index = 0; index < totalFile; index++) {
      const transcriptImport = transcriptFileUpload[index];
      dataRow.stt = index;
      dataRow.mshs = transcriptImport['Mã số học sinh'];
      dataRow.className = className;
      dataRow.schoolYear = getCurrentSchoolYear();
      dataRow.subjectCode = subjectCode;
      if (selectedSemesterNumber === 'Gk' && selectedSemester === '1') {
        dataRow.gk1 = transcriptImport['Điểm'];
        dataRow.ck1 = transcript[index].hk1Ck;
        dataRow.tbhk1 = transcript[index].hk1Tb;
        dataRow.gk2 = transcript[index].hk2Gk;
        dataRow.ck2 = transcript[index].hk2Ck;
        dataRow.tbhk2 = transcript[index].hk2Tb;
        dataRow.tbcn = transcript[index].allYear;
        dataRow.remarks = transcript[index].remarks;
      }
      if (selectedSemesterNumber === 'Ck' && selectedSemester === '1') {
        dataRow.gk1 = transcript[index].hk1Gk;
        dataRow.ck1 = transcriptImport['Điểm'];
        dataRow.tbhk1 = transcript[index].hk1Tb;
        dataRow.gk2 = transcript[index].hk2Gk;
        dataRow.ck2 = transcript[index].hk2Ck;
        dataRow.tbhk2 = transcript[index].hk2Tb;
        dataRow.tbcn = transcript[index].allYear;
        dataRow.remarks = transcript[index].remarks;
      }
      if (selectedSemesterNumber === 'Gk' && selectedSemester === '2') {
        dataRow.gk1 = transcript[index].hk1Gk;
        dataRow.ck1 = transcript[index].hk1Ck;
        dataRow.tbhk1 = transcript[index].hk1Tb;
        dataRow.gk2 = transcriptImport['Điểm'];
        dataRow.ck2 = transcript[index].hk2Ck;
        dataRow.tbhk2 = transcript[index].hk2Tb;
        dataRow.tbcn = transcript[index].allYear;
        dataRow.remarks = transcript[index].remarks;
      }
      if (selectedSemesterNumber === 'Ck' && selectedSemester === '2') {
        dataRow.gk1 = transcript[index].hk1Gk;
        dataRow.ck1 = transcript[index].hk1Ck;
        dataRow.tbhk1 = transcript[index].hk1Tb;
        dataRow.gk2 = transcript[index].hk2Gk;
        dataRow.ck2 = transcriptImport['Điểm'];
        dataRow.tbhk2 = transcript[index].hk2Tb;
        dataRow.tbcn = transcript[index].allYear;
        dataRow.remarks = transcript[index].remarks;
      }

      try {
        await updateTranscript(dataRow);
        nsuccess++;
      } catch (error) {
        nfailed++;
        console.error(error);
      }
      setSuccess(nsuccess);
      setFailed(nfailed);
      setImportProgress(Math.round(((index + 1) / totalFile) * 100));
    }
    refreshTranscript();
    setTranscriptFileUpload([]);
  };

  const handleActiveEdit = (rowIndex) => {
    const schoolYear = getCurrentSchoolYear();
    setActiveEdit((prev) => (prev === rowIndex ? '-1' : rowIndex));

    let rowData = rowIndex;

    setDataRow({
      ...dataRow,
      stt: rowData,
      mshs: transcript[rowData].studentCode,
      className: className,
      schoolYear: schoolYear,
      subjectCode: subjectCode,
      gk1: transcript[rowData].hk1Gk,
      ck1: transcript[rowData].hk1Ck,
      tbhk1: transcript[rowData].hk1Tb,
      gk2: transcript[rowData].hk2Gk,
      ck2: transcript[rowData].hk2Ck,
      tbhk2: transcript[rowData].hk2Tb,
      tbcn: transcript[rowData].allYear,
      remarks: transcript[rowData].remarks,
    });
  };

  const handleCancelEdit = () => {
    setActiveEdit('-1');
  };

  const handleOnChangeEdit = (e) => {
    const { name, value } = e.target;
    setDataRow({ ...dataRow, [name]: value });
  };

  const handleCheckValidate = () => {
    if (parseInt(dataRow.gk1) < 0 || parseInt(dataRow.gk1) > 10) {
      toast.error('Điểm không hợp lệ');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!handleCheckValidate()) return;
    try {
      await updateTranscript(dataRow);
      toast.success('Cập nhật điểm thành công');
      const schoolYear = getCurrentSchoolYear();
      const grade = className[0];
      getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade)
        .then((res) => {
          setTranscript(res.data);
        })
        .catch((error) => {
          setTranscript([]);
          console.error(
            'Get student list by class and academic year error:',
            error.response ? error.response.data : error.message
          );
        });
    } catch (error) {
      toast.error('Cập nhật điểm thất bại');
      const schoolYear = getCurrentSchoolYear();
      const grade = className[0];
      getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade)
        .then((res) => {
          setTranscript(res.data);
        })
        .catch((error) => {
          setTranscript([]);
          console.error(
            'Get student list by class and academic year error:',
            error.response ? error.response.data : error.message
          );
        });
    }
    setActiveEdit('-1');
  };

  const refreshTranscript = () => {
    document.getElementById('inputFile').value = '';
    const schoolYear = getCurrentSchoolYear();
    const grade = className[0];
    getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, className, schoolYear, grade)
      .then((res) => {
        setTranscript(res.data);
      })
      .catch((error) => {
        setTranscript([]);
        console.error(
          'Get student list by class and academic year error:',
          error.response ? error.response.data : error.message
        );
      });
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
            <div className="px-4 w-full grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block mb-2">
                  Lớp<span className="text-red-500">*</span>
                </label>
                <select
                  value={className}
                  onChange={(e) => {
                    setClassName(e.target.value);
                    setSubjectCode('');
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
              <div>
                <label className="block mb-2">
                  Môn học<span className="text-red-500">*</span>
                </label>
                <select
                  name="subjectCode"
                  value={subjectCode}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSubjectCode(e.target.value);
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
              <div>
                <label className="block mb-2">
                  Học kỳ<span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full p-2 border rounded"
                    defaultValue={''}
                  >
                    <option value={''}></option>
                    <option value={'1'}>Học kỳ 1</option>
                    <option value={'2'}>Học kỳ 2</option>
                  </select>
                  <select
                    value={selectedSemesterNumber}
                    onChange={(e) => setSelectedSemesterNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                    defaultValue={''}
                  >
                    <option value={''}></option>
                    <option value={'Gk'}>Giữa kỳ</option>
                    <option value={'Ck'}>Cuối kỳ</option>
                  </select>
                </div>
              </div>
              <div className="col-span-2 w-full grid grid-cols-3 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
                <div className="col-span-2 grid grid-cols-2 items-end justify-start gap-4">
                  <div className="">
                    <label className="block mb-2">Nhập điểm từ file Excel</label>
                    <input id="inputFile" type="file" onChange={handleFileUpload} className="w-full border rounded" />
                  </div>
                  <div className="flex items-end justify-start gap-2">
                    <button
                      onClick={handleImportTranscript}
                      type="button"
                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      <CiImport className="text-xl font-medium" />
                    </button>
                    {activeImport && (
                      <div className="grid grid-flow-col gap-5 w-96 min-w-96">
                        <span>Tiến trình: {importProgress}%</span>
                        <span>Thành công: {success}</span>
                        <span>Thất bại: {failed}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 overflow-x-auto">
              <table className="min-w-full border mb-5" style={{ userSelect: 'none', width: '100%' }}>
                <thead className=" bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 w-10 min-w-10" rowSpan={2}>
                      STT
                    </th>
                    <th onClick={() => sorting('studentCode')} className="border px-4 py-2 w-24 min-w-24" rowSpan={2}>
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
                    <th className="border px-4 py-2 w-14 min-w-14" rowSpan={2}></th>
                    <th className="border px-4 py-2 w-14 min-w-14" rowSpan={2}></th>
                  </tr>
                  <tr>
                    <th onClick={() => sorting('hk1Gk')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        GK
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
                    <th onClick={() => sorting('hk1Ck')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        CK
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
                    <th onClick={() => sorting('hk2Gk')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        GK
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
                    <th onClick={() => sorting('hk2Ck')} className="border px-4 py-2 w-28 min-w-28">
                      <span class="flex items-center">
                        CK
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
                    return (
                      <>
                        <tr className="h-16 odd:bg-white even:bg-yellow-50" key={index}>
                          <td className="border px-4 py-2 text-center">{index}</td>
                          <td className="border px-4 py-2 text-center">{student.studentCode}</td>
                          <td className="border px-4 py-2">{student.userName}</td>
                          <td className="border px-4 py-2">{student.dateOfBirth}</td>
                          <td className="border px-4 py-2 text-center">
                            {activeEdit === index ? (
                              <input
                                value={dataRow.gk1}
                                onChange={(e) => handleOnChangeEdit(e)}
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
                            {activeEdit === index ? (
                              <input
                                value={dataRow.ck1}
                                onChange={(e) => handleOnChangeEdit(e)}
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
                            {activeEdit === index ? (
                              <input
                                value={dataRow.gk2}
                                onChange={(e) => handleOnChangeEdit(e)}
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
                            {activeEdit === index ? (
                              <input
                                value={dataRow.ck2}
                                onChange={(e) => handleOnChangeEdit(e)}
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
                          <td className="border px-4 py-2 text-center  text-xl">
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
                          </td>
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
