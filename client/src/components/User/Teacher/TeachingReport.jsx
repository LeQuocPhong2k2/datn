import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BiCalendar } from 'react-icons/bi';
import { IoMdAddCircle } from 'react-icons/io';
import { IoAdd } from 'react-icons/io5';

import { getAllClassTeacher } from '../../../api/Class';
import { getSubjectByGrade } from '../../../api/Subject';
import { getTeachingPlanByTeacherAndByGradeAndBySchoolYear } from '../../../api/TeachingPlan';
import { getHomRoomTeacherCurrent } from '../../../api/Class';
import { saveTeachingReport, getTeachingReports } from '../../../api/TeachingReport';

import Menu from './Menu';
import { Toaster, toast } from 'react-hot-toast';
import { get } from 'mongoose';

export default function TeachingPlans() {
  /**
   * State
   */
  const [classQuery, setClassQuery] = useState('');
  const [dateQuery, setDateQuery] = useState(new Date());
  const [academicYearQuery, setAcademicYearQuery] = useState('');

  const [classBaoBai, setClassBaoBai] = useState(new Date());
  const [classTeachers, setClassTeachers] = useState([]);
  const [classTeachersEdit, setClassTeachersEdit] = useState([]);
  const [academicYear, setAcademicYear] = useState('');
  const [createTeachingReport, setCreateTeachingReport] = useState(false);
  const [indexClass, setIndexClass] = useState(0);
  const [indexCreate, setIndexCreate] = useState(0);
  const [opContent, setOpContent] = useState(true);
  const [listSubjects, setListSubjects] = useState([]);
  const [modalSelectTeachPlan, setModalSelectTeachPlan] = useState(false);
  const [listPlans, setListPlans] = useState([]);
  const [dateCreateTeachingReport, setDateCreateTeachingReport] = useState(new Date());
  const [listReports, setListReports] = useState([]);

  const [listBaoBai, setListBaoBai] = useState([
    {
      subject: '',
      content: '',
      contentNext: '',
      process: 0,
      note: '',
    },
  ]);

  useEffect(() => {
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    getAllClassTeacher(teacher_phoneNumber, academicYearQuery)
      .then((res) => {
        setClassTeachers(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setClassQuery('');
  }, [academicYearQuery]);

  const handleGetAllClassTeacher = async () => {
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    await getAllClassTeacher(teacher_phoneNumber, getCurrentSchoolYear())
      .then((res) => {
        setClassTeachers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeClassCreateTeachingReport = (e) => {
    const index = e.target.value;
    setIndexClass(index);

    if (index !== '') {
      setClassBaoBai(classTeachers[index].className);
      getSubjectByGrade(classTeachers[index].records[0].grade)
        .then((res) => {
          setListSubjects(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setListSubjects([]);
    }
  };

  const handleChange = (date) => {
    setDateQuery(date);
  };

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

  const handleSearchTeachingPlan = async (index, op) => {
    if (op === 'today') {
      setOpContent(true);
    } else {
      setOpContent(false);
    }

    setIndexCreate(index);
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    await getHomRoomTeacherCurrent(teacher_phoneNumber)
      .then((res) => {
        getTeachingPlanByTeacherAndByGradeAndBySchoolYear(
          res.teacher_id,
          classTeachers[indexClass].records[0].grade,
          getCurrentSchoolYear()
        )
          .then((data) => {
            setListPlans(data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddRowBaoBai = () => {
    console.log('add row');
    console.log('indexClass', indexClass);

    const newListBaoBai = [...listBaoBai];
    newListBaoBai.push({
      content: '',
      contentNext: '',
      contentPlanID: '',
      process: 0,
      note: '',
    });
    console.log('newListBaoBai', newListBaoBai);
    setListBaoBai(newListBaoBai);
  };

  const handleItemClick = (indexSubject, indexWeek, indexTopic) => {
    const newListBaoBai = [...listBaoBai];

    if (opContent) {
      newListBaoBai[indexCreate] = {
        ...newListBaoBai[indexCreate],
        content: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].name,
        process: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].process,
      };
    } else {
      newListBaoBai[indexCreate] = {
        ...newListBaoBai[indexCreate],
        contentNext: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].name,
      };
    }
    setListBaoBai(newListBaoBai);
  };

  const handleSaveBaoBai = async () => {
    if (classBaoBai === '') {
      toast.error('Vui lòng chọn lớp học');
      return;
    }

    listBaoBai.forEach((item) => {
      if (item.content === '') {
        toast.error('Vui lòng chọn nội dung bài học');
        return;
      }
    });

    console.log('listBaoBai', listBaoBai);

    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');

    await saveTeachingReport(
      getCurrentSchoolYear(),
      classBaoBai,
      teacher_phoneNumber,
      dateCreateTeachingReport,
      listBaoBai
    );
    toast.success('Lưu báo bài thành công');
    setCreateTeachingReport(false);
  };

  const handleSearchBaoBai = async () => {
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    await getTeachingReports(teacher_phoneNumber, academicYear, classQuery, dateQuery)
      .then((res) => {
        setListReports(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Menu active="teaching-report">
      {modalSelectTeachPlan && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="bg-white rounded-lg shadow-lg flex items-center justify-center">
            <div className="w-96 py-4">
              <div className="grid grid-cols-10 w-full border-b px-4">
                <div className="col-span-7 py-2">
                  <h2 className="text-xl font-semibold">Chọn nội dung bài học</h2>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setModalSelectTeachPlan(false);
                    }}
                    className="text-red-500"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              <div className="px-4 h-96 max-h-96 overflow-y-scroll">
                <ul style={{ userSelect: 'none' }}>
                  {listPlans.map((subject, indexSubject) => (
                    <li key={subject.subjectName} className="py-2">
                      <details className="group relative">
                        <summary className="cursor-pointer font-bold text-base text-blue-600 hover:underline">
                          {subject.subjectName}
                        </summary>
                        <ul className="ml-4 mt-2">
                          {subject.week.map((week, indexWeek) => (
                            <li key={week.weekNumber} className="py-2">
                              <details className="group">
                                <summary className="cursor-pointer font-medium text-lg text-green-600 hover:underline">
                                  Tuần {week.weekNumber}
                                </summary>
                                <ul className="ml-4 mt-2">
                                  {week.topics.map((topic, indexTopic) => (
                                    <li
                                      onClick={() => {
                                        handleItemClick(indexSubject, indexWeek, indexTopic);
                                        setModalSelectTeachPlan(false);
                                      }}
                                      key={indexTopic}
                                      className="py-1 cursor-pointer text-gray-700 hover:underline text-lg"
                                    >
                                      {'Bài ' + indexTopic + '. ' + topic[0].name + ' (' + topic[0].duration + ' tiết)'}
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster toastOptions={{ duration: 2500 }} />

      <div className="flex flex-wrap">
        <div className="w-full px-4 mb-4 mt-4 grid grid-cols-12">
          {!createTeachingReport && (
            <div className="col-span-12 p-6 bg-white rounded-lg shadow-lg">
              <div className="flex flex-wrap gap-8 text-lg">
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-28 bg-gray-300">
                    <span className="font-semibold">Năm học</span>
                  </div>
                  <select
                    onChange={(e) => {
                      setAcademicYear(e.target.value);
                      setAcademicYearQuery(e.target.value);
                      setClassQuery('');
                      setClassTeachers([]);
                    }}
                    value={academicYearQuery}
                    className="h-9 px-2 py-1 rounded w-32"
                    defaultValue={''}
                  >
                    <option value=""></option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-28 bg-gray-300">
                    <span className="font-semibold">Lớp học</span>
                  </div>
                  <select
                    onChange={(e) => {
                      setClassQuery(e.target.value);
                    }}
                    value={classQuery}
                    className="h-9 px-2 py-1 rounded w-48"
                    defaultValue={''}
                  >
                    <option value=""></option>
                    {classTeachers.map((classTeacher) => (
                      <option key={classTeacher._id} value={classTeacher.className}>
                        {classTeacher.className}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-28 bg-gray-300">
                    <span className="font-semibold">Ngày</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <DatePicker
                      selected={dateQuery}
                      onChange={handleChange}
                      dateFormat="dd/MM/yyyy"
                      className="h-9 px-2 py-1 rounded w-36"
                      placeholderText="dd/mm/yyyy"
                    />
                    <div className="relative">
                      <BiCalendar
                        className="absolute right-2 -top-3 text-gray-500 pointer-events-none cursor-pointer"
                        size={24}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div
                    onClick={handleSearchBaoBai}
                    className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-600 cursor-pointer text-white"
                  >
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </div>
                  <div className="">
                    <button
                      onClick={() => {
                        setCreateTeachingReport(true);
                        handleGetAllClassTeacher();
                        setListSubjects([]);
                        setListBaoBai([
                          {
                            content: '',
                            contentNext: '',
                            process: 0,
                            contentPlanID: '',
                            note: '',
                          },
                        ]);
                      }}
                      className="h-9 flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
                    >
                      <i class="fa-solid fa-plus"></i>
                      Thêm báo bài
                    </button>
                  </div>
                </div>
              </div>
              {/* table */}
              <div>
                {listReports.length === 0 && (
                  <div className="text-center text-lg font-semibold py-4">Không có dữ liệu</div>
                )}
                {listReports.length > 0 &&
                  listReports.map((report, index) => (
                    <div key={index} className="mt-4">
                      <div className="flex items-center justify-start gap-2 bg-gray-200 text-black uppercase text-xl leading-normal py-3 px-6">
                        <p> {report.subject[0] && report.subject[0].subjectName + ' - ' + report._id.date}</p>
                        <i class="fa-solid fa-pen-to-square text-blue-500 hover:text-blue-700 cursor-pointer"></i>
                      </div>
                      <div className="text-black text-lg font-light border-b border-gray-200 py-3 px-6">
                        <p>
                          <strong>Nội dung bài học hôm nay:</strong> {report.reports[0].content}
                        </p>
                        <p>
                          <strong>Nội dung bài học tiếp theo:</strong> {report.reports[0].contentNext}
                        </p>
                        <p>
                          <strong>Ghi chú:</strong> {report.reports[0].note}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tạo báo bài */}
          {createTeachingReport && (
            <div className="col-span-12 p-6 bg-white rounded-lg shadow-lg">
              <div className="text-base font-semibold mb-4 flex items-center justify-start gap-10 p-2">
                <div className="flex items-center justify-start gap-2">
                  <button
                    onClick={handleSaveBaoBai}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-check text-yellow-300"></i>Done
                  </button>
                  <button
                    onClick={() => {
                      setClassBaoBai('');
                      setCreateTeachingReport(false);
                      setListSubjects([]);
                      setListBaoBai([
                        {
                          content: '',
                          contentNext: '',
                          process: 0,
                          note: '',
                        },
                      ]);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-xmark"></i>Close
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 text-base font-semibold mb-4 items-center justify-start p-2">
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-28 bg-gray-300">
                    <span className="font-semibold">Năm học</span>
                  </div>
                  <select
                    disabled
                    value={getCurrentSchoolYear()}
                    className="h-8 px-2 py-1 rounded w-32 font-normal"
                    defaultValue={getCurrentSchoolYear()}
                  >
                    <option value=""></option>
                    <option value="2023-2024">2023-2024</option>
                    <option value="2024-2025">2024-2025</option>
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-28 bg-gray-300">
                    <span className="font-semibold">
                      Lớp học<span className="text-red-700">*</span>
                    </span>
                  </div>
                  <select
                    onChange={(e) => handleChangeClassCreateTeachingReport(e)}
                    className="h-8 px-2 py-1 rounded w-48 font-normal"
                    defaultValue={''}
                  >
                    <option value=""></option>
                    {classTeachers.map((classTeacher, indexClassTeacher) => (
                      <option key={classTeacher._id} value={indexClassTeacher}>
                        {classTeacher.className}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-32 bg-gray-300">
                    <span className="font-semibold">Ngày hiện tại</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <DatePicker
                      disabled
                      selected={dateCreateTeachingReport}
                      onChange={handleChange}
                      dateFormat="dd/MM/yyyy"
                      className="h-8 px-2 py-1 rounded w-36 font-normal"
                      placeholderText="dd/mm/yyyy"
                    />
                    <div className="relative">
                      <BiCalendar
                        className="absolute right-2 -top-3 text-gray-500 pointer-events-none cursor-pointer"
                        size={24}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-base font-semibold mb-4 items-center justify-start p-2">
                <table className="table-auto w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left w-24">
                        Môn học<span className="text-red-700">*</span>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left w-32">
                        Bài học hôm nay<span className="text-red-700">*</span>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-center w-14">
                        Tiến độ (%)<span className="text-red-700">*</span>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left w-32">
                        Bài học tiếp theo<span className="text-red-700">*</span>
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left w-60">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listBaoBai.map((item, index) => (
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          <select
                            onChange={(e) => {
                              const newListBaoBai = [...listBaoBai];
                              newListBaoBai[index] = {
                                ...newListBaoBai[index],
                                subject: e.target.value,
                              };
                              setListBaoBai(newListBaoBai);
                            }}
                            value={item.subject}
                            className="w-full h-8 px-2 py-1 rounded font-normal"
                          >
                            {listSubjects.length > 0 &&
                              listSubjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>
                                  {subject.subjectName}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.content === '' ? (
                            <div
                              onClick={() => {
                                setModalSelectTeachPlan(true);
                                handleSearchTeachingPlan(index, 'today');
                              }}
                              className="flex items-center justify-start cursor-pointer"
                            >
                              <IoAdd className="text-xl text-blue-500 hover:text-blue-700" />
                              <p className="font-normal text-blue-500 hover:text-blue-700"> Thêm nội dung bài học</p>
                            </div>
                          ) : (
                            <span className="font-normal">{item.content}</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <input
                            value={item.process}
                            type="number"
                            onChange={(e) => {
                              const newListBaoBai = [...listBaoBai];
                              newListBaoBai[index] = {
                                ...newListBaoBai[index],
                                process: e.target.value,
                              };
                              setListBaoBai(newListBaoBai);
                            }}
                            className="w-full h-8 px-2 py-1 rounded font-normal"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.contentNext === '' ? (
                            <div
                              onClick={() => {
                                setModalSelectTeachPlan(true);
                                handleSearchTeachingPlan(index, 'next');
                              }}
                              className="flex items-center justify-start cursor-pointer"
                            >
                              <IoAdd className="text-xl text-blue-500 hover:text-blue-700" />
                              <p className="font-normal text-blue-500 hover:text-blue-700"> Thêm nội dung bài học</p>
                            </div>
                          ) : (
                            <span className="font-normal">{item.contentNext}</span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            onChange={(e) => {
                              const newListBaoBai = [...listBaoBai];
                              newListBaoBai[index] = {
                                ...newListBaoBai[index],
                                note: e.target.value,
                              };
                              setListBaoBai(newListBaoBai);
                            }}
                            type="text"
                            className="w-full h-8 px-2 py-1 rounded font-normal"
                          />
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <div className="p-2">
                        <IoMdAddCircle
                          onClick={() => {
                            handleAddRowBaoBai();
                          }}
                          className="text-xl text-blue-500 hover:text-blue-700 cursor-pointer"
                        />
                      </div>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Menu>
  );
}
