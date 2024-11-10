import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import { RiEdit2Fill } from 'react-icons/ri';
import { RiSave3Fill } from 'react-icons/ri';
import { GrRefresh } from 'react-icons/gr';
import { CiExport } from 'react-icons/ci';
import { CiImport } from 'react-icons/ci';

import * as XLSX from 'xlsx';

import { getSubjectByGrade } from '../../api/Subject';
import { getTranscriptBySubjectAndClassAndSchoolYear, updateTranscript } from '../../api/Transcripts';

export default function InputScore() {
  const [activeImport, setActiveImport] = useState(false);
  const [success, setSuccess] = useState(0);
  const [failed, setFailed] = useState(0);
  const [importProgress, setImportProgress] = useState(0);
  const [order, setOrder] = useState('ASC');
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSemesterNumber, setSelectedSemesterNumber] = useState('');
  const [grade, setGrade] = useState('');
  const [classroom, setClassroom] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectList, setSubjectList] = useState([]);
  const [student, setStudent] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [transcriptBk, setTranscriptBk] = useState([]);
  const [transcriptFileUpload, setTranscriptFileUpload] = useState([]);
  const [subject, setSubject] = useState('');
  const [activeEdit, setActiveEdit] = useState('-1');
  const [arrClassNames, setArrClassNames] = useState([
    '1A1',
    '1A2',
    '1A3',
    '1A4',
    '1A5',
    '2A1',
    '2A2',
    '2A3',
    '2A4',
    '2A5',
    '3A1',
    '3A2',
    '3A3',
    '3A4',
    '3A5',
    '4A1',
    '4A2',
    '4A3',
    '4A4',
    '4A5',
    '5A1',
    '5A2',
    '5A3',
    '5A4',
    '5A5',
  ]);
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

  let arrClasses = [
    '1A1',
    '1A2',
    '1A3',
    '1A4',
    '1A5',
    '2A1',
    '2A2',
    '2A3',
    '2A4',
    '2A5',
    '3A1',
    '3A2',
    '3A3',
    '3A4',
    '3A5',
    '4A1',
    '4A2',
    '4A3',
    '4A4',
    '4A5',
    '5A1',
    '5A2',
    '5A3',
    '5A4',
    '5A5',
  ];

  /**
   * handle file upload
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
      setTranscriptFileUpload(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportTranscript = async () => {
    if (grade === '') {
      toast.error('Please select a grade');
      return;
    }
    if (classroom === '') {
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
      dataRow.className = classroom;
      dataRow.schoolYear = getCurrentYear();
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

  const filterClassesByGrade = (grade) => {
    return arrClasses.filter((className) => className.startsWith(grade.toString()));
  };

  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  const getCurrentYear = () => {
    const date = new Date();
    const year = date.getFullYear();
    return `${year}-${year + 1}`;
  };

  useEffect(() => {
    handlePageLoading();
  }, []);

  const handleChangeGrade = (e) => {
    setGrade(e.target.value);
    let filteredClasses = filterClassesByGrade(e.target.value);
    setArrClassNames(filteredClasses);
  };

  useEffect(() => {
    setSubjectCode('');
    setClassroom('');
    setSelectedSemester('');
    setSelectedSemesterNumber('');
    setTranscript([]);
    setTranscriptBk([]);
    setImportProgress(0);
    setSuccess(0);
    setFailed(0);
    getSubjectByGrade(grade)
      .then((res) => setSubjectList(res))
      .catch((error) =>
        console.error('Get subject by grade error:', error.response ? error.response.data : error.message)
      );
  }, [grade]);

  useEffect(() => {
    const schoolYear = getCurrentYear();
    getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, classroom, schoolYear, grade)
      .then((res) => {
        setTranscript(res.data);
        setTranscriptBk(res.data);
        if (res.data && res.data.length > 0) {
          handlePageLoading();
        }
      })
      .catch((error) => {
        setTranscript([]);
        setTranscriptBk([]);
        console.error(
          'Get student list by class and academic year error:',
          error.response ? error.response.data : error.message
        );
      });
  }, [subjectCode, classroom, grade]);

  const handleActiveEdit = (rowIndex) => {
    const schoolYear = getCurrentYear();
    setActiveEdit((prev) => (prev === rowIndex ? '-1' : rowIndex));
    setDataRow({
      ...dataRow,
      stt: rowIndex,
      mshs: transcript[rowIndex].studentCode,
      className: classroom,
      schoolYear: schoolYear,
      subjectCode: subjectCode,
      gk1: transcript[rowIndex].hk1Gk,
      ck1: transcript[rowIndex].hk1Ck,
      tbhk1: transcript[rowIndex].hk1Tb,
      gk2: transcript[rowIndex].hk2Gk,
      ck2: transcript[rowIndex].hk2Ck,
      tbhk2: transcript[rowIndex].hk2Tb,
      tbcn: transcript[rowIndex].allYear,
      remarks: transcript[rowIndex].remarks,
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
    } catch (error) {
      toast.error('Cập nhật điểm thất bại');
    }
    refreshTranscript();
    setActiveEdit('-1');
  };

  const refreshTranscript = () => {
    const schoolYear = getCurrentYear();
    getTranscriptBySubjectAndClassAndSchoolYear(subjectCode, classroom, schoolYear, grade)
      .then((res) => {
        setTranscript(res.data);
        handlePageLoading();
      })
      .catch((error) => {
        setTranscript([]);
        handlePageLoading();
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
      <Toaster toastOptions={{ duration: 2500 }} />
      {pageLoading && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-full h-full items-center justify-center overflow-auto relative"
        >
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
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
                fill="#1C64F2"
              />
            </svg>
          </button>
        </div>
      )}
      {!pageLoading && (
        <div className="px-4">
          <div className="px-4 py-4 rounded shadow bg-white ">
            <h2 className="text-xl font-bold mb-4 text-center">Nhập Điểm Cho Học Sinh Tiểu Học</h2>
            <div className="w-full grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-2">
                  Khối<span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={grade}
                  onChange={(e) => handleChangeGrade(e)}
                  defaultValue={''}
                >
                  <option value="" selected></option>
                  <option value={'1'}>Khối 1</option>
                  <option value={'2'}>Khối 2</option>
                  <option value={'3'}>Khối 3</option>
                  <option value={'4'}>Khối 4</option>
                  <option value={'5'}>Khối 5</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">
                  Lớp<span className="text-red-500">*</span>
                </label>
                <select
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  className="w-full p-2 border rounded"
                  style={{ zIndex: 10 }}
                  defaultValue={''}
                >
                  <option value="" selected></option>
                  {arrClassNames.map((classroom, i) => (
                    <option key={i} value={classroom}>
                      {classroom}
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
                  onChange={(e) => setSubjectCode(e.target.value)}
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
                    <input type="file" onChange={handleFileUpload} className="w-full border rounded" />
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
                      <div className="grid grid-flow-col gap-5">
                        <span>Process: {importProgress}%</span>
                        <span>Thành công: {success}</span>
                        <span>Thất bại: {failed}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-end">
                  <button className="w-48 font-medium relative flex items-center justify-start gap-2 border px-4 py-2 rounded shadow bg-gray-300 hover:bg-gray-400">
                    <CiExport />
                    Export bảng điểm
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border" style={{ userSelect: 'none', width: '100%' }}>
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
                  {transcript.map((student, index) => (
                    <tr className="h-16 odd:bg-white even:bg-yellow-50" key={index}>
                      <td className="border px-4 py-2 text-center">{index + 1}</td>
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
                      <td className="border px-4 py-2 text-center cursor-pointer text-xl">
                        {activeEdit === index ? (
                          <div
                            onClick={() => handleSave()}
                            className="flex items-center justify-center hover:text-blue-700"
                          >
                            <RiSave3Fill className="hover:text-green-700 text-green-500" />
                          </div>
                        ) : (
                          <div
                            onClick={() => handleActiveEdit(index)}
                            className="flex items-center justify-center hover:text-blue-700"
                          >
                            <RiEdit2Fill className="hover:text-red-700 text-red-500" />
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
