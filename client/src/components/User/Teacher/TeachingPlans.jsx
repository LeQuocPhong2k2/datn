import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { RiSubtractFill } from 'react-icons/ri';
import { BiExport } from 'react-icons/bi';

import Menu from './Menu';

import {
  saveTeachingPlans,
  getTeachingPlanByTeacherAndByGradeAndBySchoolYear,
  updateTeachingPlan,
} from '../../../api/TeachingPlan';
import { getHomRoomTeacherCurrent } from '../../../api/Class';
import { getSubjectByGrade } from '../../../api/Subject';

import { Toaster, toast } from 'react-hot-toast';

export default function TeachingPlans() {
  /**
   * State variables
   */
  const [academicYear, setAcademicYear] = useState('');
  const [grade, setGrade] = useState('');
  const [showUpdatedPlan, setShowUpdatedPlan] = useState(false);
  const [indexWeek, setIndexWeek] = useState(0);
  const [indexSubject, setIndexSubject] = useState(0);
  const [indexTopic, setIndexTopic] = useState(0);
  const [listSubjects, setListSubjects] = useState([]);
  const [listPlans, setListPlans] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [createPlan, setCreatePlan] = useState(false);
  const [selectedItemTopic, setSelectedItemTopic] = useState({
    index: -1,
    name: '',
    duration: 0,
    process: 0,
  });
  const [planEdit, setPlanEdit] = useState({});
  const [plans, setPlan] = useState([
    {
      academicYear: '',
      grade: '',
      subject: '',
      weeks: [
        {
          weekNumber: 1,
          topics: [
            {
              name: '',
              duration: 0,
              process: 0,
            },
          ],
        },
      ],
    },
  ]);

  /**
   * Handle functions
   */
  useEffect(() => {
    getSubjectByGrade(grade)
      .then((data) => {
        console.log(data);
        setListSubjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [grade]);

  const handleSearchTeachingPlan = async () => {
    if (academicYear === '') {
      toast.error('Hãy chọn năm học');
      return;
    }

    if (grade === '') {
      toast.error('Hãy chọn khối lớp');
      return;
    }

    const teacher_phoneNumber = sessionStorage.getItem('phoneNumberTeacher');
    await getHomRoomTeacherCurrent(teacher_phoneNumber)
      .then((res) => {
        setTeacherInfo(res);
        getTeachingPlanByTeacherAndByGradeAndBySchoolYear(res.teacher_id, grade, academicYear)
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

  const handleOnClickCreatePlan = () => {
    if (academicYear === '') {
      toast.error('Hãy chọn năm học');
      return;
    }

    if (isAcademicYearSmaller(getCurrentSchoolYear(), academicYear)) {
      toast.error('Năm học này đã kết thúc');
      return;
    }
    handleResetPlans();
    setCreatePlan(true);
    setShowUpdatedPlan(false);
  };

  function isAcademicYearSmaller(currentYear, targetYear) {
    // Chuyển đổi năm học thành các số nguyên
    const [currentStart, currentEnd] = currentYear.split('-').map(Number);
    const [targetStart, targetEnd] = targetYear.split('-').map(Number);

    // So sánh năm bắt đầu
    if (targetStart < currentStart) {
      return true; // Năm học cần kiểm tra bé hơn
    }
    if (targetStart === currentStart && targetEnd < currentEnd) {
      return true; // Năm bắt đầu bằng nhau nhưng năm kết thúc nhỏ hơn
    }

    return false; // Năm học không bé hơn
  }

  const handleAddPlan = () => {
    const newPlan = {
      academicYear: academicYear,
      grade: grade,
      subject: '',
      weeks: [
        {
          weekNumber: 1,
          topics: [
            {
              name: '',
              duration: 0,
              process: 0,
            },
          ],
        },
      ],
    };
    setPlan([...plans, newPlan]);
  };

  const handleAddWeek = (planIndex) => {
    const newWeek = {
      weekNumber: plans[planIndex].weeks.length + 1,
      topics: [
        {
          name: '',
          duration: 0,
          process: 0,
        },
      ],
    };
    const updatedWeeks = [...plans[planIndex].weeks, newWeek];
    const updatedPlan = [...plans];
    updatedPlan[planIndex].weeks = updatedWeeks;
    setPlan(updatedPlan);
  };

  const handleAddTopic = (planIndex, weekIndex) => {
    const updatedWeeks = [...plans[planIndex].weeks];
    const newTopic = {
      name: '',
      duration: 0,
    };
    updatedWeeks[weekIndex].topics.push(newTopic);
    const updatedPlan = [...plans];
    updatedPlan[planIndex].weeks = updatedWeeks;
    setPlan(updatedPlan);
  };

  const handleRemoveTopic = (planIndex, weekIndex, topicIndex) => {
    const updatedWeeks = [...plans[planIndex].weeks];
    updatedWeeks[weekIndex].topics = updatedWeeks[weekIndex].topics.filter((_, index) => index !== topicIndex);
    const updatedPlan = [...plans];
    updatedPlan[planIndex].weeks = updatedWeeks;
    setPlan(updatedPlan);
  };

  const handleRemoveWeek = (planIndex, weekIndex) => {
    const updatedWeeks = plans[planIndex].weeks.filter((_, index) => index !== weekIndex);
    const updatedPlan = [...plans];
    updatedPlan[planIndex].weeks = updatedWeeks;
    setPlan(updatedPlan);
  };

  const handleRemoveChapter = (planIndex) => {
    const updatedPlan = plans.filter((_, index) => index !== planIndex);
    setPlan(updatedPlan);
  };

  const handleSavePlan = async () => {
    const isValid = plans.every((plan) => {
      if (plan.className === '') {
        toast.error('Lớp học không được để trống');
        return false;
      }

      if (plan.subject === '') {
        toast.error('Môn học không được để trống');
        return false;
      }

      const isWeekValid = plan.weeks.every((week) => {
        const isTopicValid = week.topics.every((topic) => {
          if (topic.name === '' || topic.duration === 0) {
            toast.error('Tên chương hoặc thời lượng không được để trống');
            return false;
          }
          return true;
        });

        return isTopicValid;
      });

      return isWeekValid;
    });

    if (!isValid) {
      return;
    }

    const teacherPhoneNumber = sessionStorage.getItem('phoneNumberTeacher');
    if (!teacherPhoneNumber) {
      toast.error('Không tìm thấy thông tin giáo viên');
      return;
    }

    try {
      const updatedPlan = [...plans];
      updatedPlan[0].academicYear = academicYear;
      updatedPlan[0].grade = grade;
      setPlan(updatedPlan);
      await saveTeachingPlans(plans, teacherPhoneNumber, academicYear);
      handleSearchTeachingPlan();
      setCreatePlan(false);
      setShowUpdatedPlan(false);
      toast.success('Tạo kế hoạch giảng dạy thành công');
    } catch (error) {
      console.error(error);
      toast.error('Tạo kế hoạch giảng dạy thất bại');
    }
  };

  const handleChangeSubject = (e, index) => {
    const updatedPlan = [...plans];
    const isSubjectExist = updatedPlan.some((plan) => plan.subject === e.target.value);
    if (isSubjectExist) {
      toast.error('Môn học đã được chọn');
    } else {
      updatedPlan[index].subject = e.target.value;
      setPlan(updatedPlan);
    }
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

  const handleItemClick = (indexSubject, indexWeek, indexTopic) => {
    setIndexWeek(indexWeek);
    setIndexSubject(indexSubject);
    setIndexTopic(indexTopic);
    setSelectedItemTopic({
      indexWeek: indexWeek,
      indexSubject: indexSubject,
      indexTopic: indexTopic,
      name: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].name,
      duration: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].duration,
      process: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].process,
    });
  };

  const handleEditTopic = () => {
    setPlanEdit(listPlans[indexSubject]);

    getSubjectByGrade(grade)
      .then((data) => {
        console.log(data);
        setListSubjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
    setCreatePlan(false);
    setShowUpdatedPlan(true);
  };

  const handleResetPlans = () => {
    setPlan([
      {
        academicYear: '',
        grade: '',
        subject: '',
        weeks: [
          {
            weekNumber: 1,
            topics: [
              {
                name: '',
                duration: 0,
                process: 0,
              },
            ],
          },
        ],
      },
    ]);
  };

  const handleUpdatePlan = async () => {
    const isValid = planEdit.week.every((plan) => {
      if (planEdit._id === '') {
        toast.error('Môn học không được để trống');
        return false;
      }

      const isWeekValid = plan.topics.every((topic) => {
        if (topic[0].name === '' || topic[0].duration === undefined || topic[0].duration === '') {
          toast.error('Tên chương hoặc thời lượng không được để trống');
          return false;
        }
        return true;
      });

      return isWeekValid;
    });

    if (!isValid) {
      return;
    }
    const teacherPhoneNumber = sessionStorage.getItem('phoneNumberTeacher');
    if (!teacherPhoneNumber) {
      toast.error('Không tìm thấy thông tin giáo viên');
      return;
    }

    try {
      await updateTeachingPlan(planEdit, teacherPhoneNumber, academicYear, grade);
      toast.success('Cập nhật kế hoạch giảng dạy thành công');
      handleSearchTeachingPlan();
      setSelectedItemTopic({
        indexWeek: indexWeek,
        indexSubject: indexSubject,
        indexTopic: indexTopic,
        name: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].name,
        duration: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].duration,
        process: listPlans[indexSubject].week[indexWeek].topics[indexTopic][0].process,
      });
      setCreatePlan(false);
      setShowUpdatedPlan(false);
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật kế hoạch giảng dạy thất bại');
    }
  };

  const handleRemoveTopicUpdate = (weekIndex, topicIndex) => {
    const week = planEdit.week[weekIndex];
    week.topics.splice(topicIndex, 1);
    const updatedPlan = { ...planEdit };
    updatedPlan.week[weekIndex] = week;
    setPlanEdit(updatedPlan);
  };

  const handleAddTopicUpdate = (weekIndex) => {
    const newTopic = [
      {
        name: '',
        duration: 0,
        process: 0,
      },
    ];
    const week = planEdit.week[weekIndex];
    week.topics.push(newTopic);
    const updatedPlan = { ...planEdit };
    updatedPlan.week[weekIndex] = week;
    setPlanEdit(updatedPlan);
  };

  const handleRemoveWeekUpdate = (weekIndex) => {
    const updatedPlan = { ...planEdit };
    updatedPlan.week.splice(weekIndex, 1);
    setPlanEdit(updatedPlan);
  };

  const handleAddWeekUpdate = () => {
    const newWeek = {
      weekNumber: planEdit.week.length + 1,
      topics: [
        [
          {
            name: '',
            duration: 0,
            process: 0,
          },
        ],
      ],
    };
    const updatedPlan = { ...planEdit };
    updatedPlan.week.push(newWeek);
    setPlanEdit(updatedPlan);
  };

  return (
    <Menu active="teaching-plans">
      <Toaster toastOptions={{ duration: 2500 }} />
      <div className="flex flex-wrap">
        {!createPlan && !showUpdatedPlan && (
          <div className="w-full px-4 mb-4 mt-4 grid grid-cols-12">
            <div className="col-span-12 p-6 bg-white rounded-lg shadow-lg">
              {/* button */}
              <div className="grid grid-cols-10 items-center justify-start border-b">
                <div className="col-span-7 flex flex-wrap items-center justify-start gap-4 py-4 text-lg">
                  <div className="flex items-center justify-start gap-2">
                    <div className="px-2 py-1 w-28 bg-gray-300">
                      <span className="font-semibold">
                        Năm học<span className="text-red-700">*</span>
                      </span>
                    </div>
                    <select
                      onChange={(e) => {
                        setAcademicYear(e.target.value);
                      }}
                      value={academicYear}
                      className="h-8 px-2 py-1 rounded w-32"
                      defaultValue={''}
                    >
                      <option value=""></option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <div className="px-2 py-1 w-28 bg-gray-300">
                      <span className="font-semibold">
                        Khối lớp<span className="text-red-700">*</span>
                      </span>
                    </div>
                    <select
                      onChange={(e) => {
                        const updatedPlan = [...plans];
                        updatedPlan[0].className = e.target.value;
                        setPlan(updatedPlan);
                        setGrade(e.target.value);
                      }}
                      value={grade}
                      className="h-8 rounded w-20 px-2 py-1"
                      name=""
                      id=""
                      defaultValue={''}
                    >
                      <option value={''}></option>
                      <option value={'1'}>1</option>
                      <option value={'2'}>2</option>
                      <option value={'3'}>3</option>
                      <option value={'4'}>4</option>
                      <option value={'5'}>5</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-start">
                    <div
                      onClick={handleSearchTeachingPlan}
                      className="px-3 py-1 rounded bg-sky-500 hover:bg-sky-600 cursor-pointer text-white"
                    >
                      <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                  </div>
                </div>
                <div className="col-span-3 flex items-center justify-end">
                  <button className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    <BiExport className="text-xl" />
                    Export to excel
                  </button>
                </div>
              </div>
              {/* content */}
              <div className="flex">
                {/* Left Column: Tree View */}
                <div className="w-1/2 border-r p-4">
                  <div className="flex items-center justify-start gap-4 text-xl mb-4">
                    <div className="flex items-center justify-start gap-1">
                      <i class="fa-solid fa-bars"></i>
                      <h2 className="text-xl font-bold">Plan overview</h2>
                    </div>
                    {listPlans.length !== 0 && (
                      <i
                        onClick={handleOnClickCreatePlan}
                        class="fa-solid fa-circle-plus cursor-pointer text-blue-500 hover:text-blue-700"
                      ></i>
                    )}
                  </div>
                  {grade === '' && <p className="text-gray-500">Hãy chọn khối để xem kế hoạch giảng dạy.</p>}
                  {listPlans.length === 0 && (
                    <div className="pt-4 flex items-center justify-start gap-2">
                      <button
                        onClick={handleOnClickCreatePlan}
                        className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Create the plan
                      </button>
                    </div>
                  )}
                  <ul style={{ userSelect: 'none' }}>
                    {listPlans.map((subject, indexSubject) => (
                      <li key={subject.subjectName} className="py-2">
                        <details className="group relative">
                          <summary className="cursor-pointer font-bold text-lg text-blue-600 hover:underline">
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
                                        key={indexTopic}
                                        className="py-1 cursor-pointer text-gray-700 hover:underline text-lg"
                                        onClick={() => handleItemClick(indexSubject, indexWeek, indexTopic)}
                                      >
                                        {'Bài ' +
                                          indexTopic +
                                          '. ' +
                                          topic[0].name +
                                          ' (' +
                                          topic[0].duration +
                                          ' tiết)'}
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

                {/* Right Column: Details View */}
                <div className="w-1/2 p-4">
                  <div className="flex items-center justify-start gap-4 text-xl mb-4">
                    <h2 className="text-xl font-bold ">
                      <i class="fa-solid fa-circle-info pr-1"></i>Thông tin chi tiết
                    </h2>
                    <div className="flex items-center justify-end gap-4 text-xl px-2 cursor-pointer">
                      {selectedItemTopic.index !== -1 && (
                        <i
                          onClick={handleEditTopic}
                          class="fa-solid fa-pen-to-square text-blue-500 hover:text-blue-700"
                        ></i>
                      )}
                    </div>
                  </div>
                  {selectedItemTopic.index !== -1 ? (
                    <>
                      <div className="p-4 bg-gray-100 rounded shadow text-lg">
                        <div className="grid grid-rows-2 py-2">
                          <span className="font-semibold">Tên chủ đề:</span>
                          <input
                            disabled={true}
                            value={selectedItemTopic.name}
                            onChange={(e) => {
                              setSelectedItemTopic({ ...selectedItemTopic, name: e.target.value });
                            }}
                            className={`h-8 rounded text-lg focus:outline-none focus:ring-0 border-none`}
                            type="text"
                          />
                        </div>
                        <div className="grid grid-rows-2 py-2">
                          <span className="font-semibold">Thời lượng (tiết):</span>
                          <input
                            disabled={true}
                            value={selectedItemTopic.duration}
                            onChange={(e) => {
                              setSelectedItemTopic({ ...selectedItemTopic, duration: e.target.value });
                            }}
                            className={`h-8 rounded text-lg focus:outline-none focus:ring-0 border-none`}
                            type="number"
                          />
                        </div>
                        <div className="grid grid-rows-2 gap-1 py-2">
                          <div className="flex items-center justify-start gap-1">
                            <span className="font-semibold">Tiến độ (%):</span>
                            <input
                              type="number"
                              disabled={true}
                              value={selectedItemTopic.process}
                              onChange={(e) => {
                                setSelectedItemTopic({ ...selectedItemTopic, process: e.target.value });
                              }}
                              className={`w-16 h-8 rounded text-lg px-2 py-1 focus:outline-none focus:ring-0 border-none`}
                            />
                          </div>
                          <div
                            className="flex items-center justify-start border rounded-lg h-5 overflow-x-hidden bg-white"
                            style={{ width: `${100}%` }}
                          >
                            <div
                              className="rounded-s-lg bg-blue-500 h-full"
                              style={{ width: `${selectedItemTopic.process}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500">Hãy chọn một chủ đề để xem chi tiết.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* plan create */}
        {createPlan && (
          <div className="w-full px-4 mb-4 mt-4">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-base font-semibold mb-4 flex items-center justify-start gap-10 p-2">
                <div className="flex items-center justify-start gap-2">
                  <button
                    onClick={() => handleSavePlan()}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-check text-yellow-300"></i>Done
                  </button>
                  <button
                    onClick={() => {
                      setCreatePlan(false);
                      handleResetPlans();
                    }}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-xmark"></i>Close
                  </button>
                </div>
                {!showUpdatedPlan && (
                  <div className="flex items-center justify-end gap-5">
                    <button className="flex items-center justify-center gap-2 hover:text-blue-500 hover:ring-1 hover:ring-blue-500 border border-gray-500 py-2 px-4 rounded">
                      <i class="fa-solid fa-file-arrow-down text-yellow-400"></i>Import to excel
                    </button>
                  </div>
                )}
              </div>
              <div className="px-2 py-2 pb-4 flex flex-wrap gap-5">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-24 font-semibold px-2 py-1 bg-gray-400">
                    <span>Năm học</span>
                  </div>
                  <div>
                    <input
                      value={academicYear}
                      className="h-8 rounded w-44 bg-gray-200 text-gray-800 border-none"
                      type="text"
                      disabled
                    />
                  </div>
                </div>

                {!showUpdatedPlan && (
                  <div className="flex items-center justify-start gap-2">
                    <div className="w-24 font-semibold px-2 py-1 bg-gray-400">
                      <span>
                        Khối lớp<span className="text-red-700">*</span>
                      </span>
                    </div>
                    <div className="">
                      <select
                        onChange={(e) => {
                          const updatedPlan = [...plans];
                          updatedPlan[0].grade = e.target.value;
                          setPlan(updatedPlan);
                          setGrade(e.target.value);
                        }}
                        value={grade}
                        className="h-8 rounded w-20 px-2 py-1"
                        name=""
                        id=""
                        defaultValue={'1'}
                      >
                        <option value={'1'}>1</option>
                        <option value={'2'}>2</option>
                        <option value={'3'}>3</option>
                        <option value={'4'}>4</option>
                        <option value={'5'}>5</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-lg w-full ">
                <div class="card mb-4 overflow-hidden chapter-container">
                  <div class="px-2 grid grid-cols-10">
                    <div className="col-span-2 py-1 px-2 border-t border-l bg-gray-400">
                      <span className="font-medium">
                        Chapters<span className="text-red-700">*</span>
                      </span>
                    </div>
                    <div className="col-span-8 grid grid-cols-10">
                      <div className="col-span-3 py-1 px-2 border-t border-l bg-gray-400">
                        <span className="font-medium">
                          Weeks<span className="text-red-700">*</span>
                        </span>
                      </div>
                      <div className="col-span-7 py-1 px-2 border-t border-r border-l bg-gray-400">
                        <span className="font-medium">
                          Topics<span className="text-red-700">*</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {plans.map((plan, index) => (
                    <div class="card-body px-2 grid grid-cols-10 chapter-template">
                      <div class="col-span-2 border-l border-b">
                        <div className="border-t px-2 py-2 grid grid-cols-10 gap-2">
                          <div className="col-span-9">
                            <select
                              onChange={(e) => {
                                handleChangeSubject(e, index);
                              }}
                              value={plan.subject}
                              className="w-full rounded h-10 border"
                              name=""
                              id=""
                            >
                              <option value=""></option>
                              {listSubjects.map((subject) => (
                                <option value={subject.subjectCode}>{subject.subjectName}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1 flex items-center">
                            {plans.length > 1 ? (
                              <button
                                onClick={() => handleRemoveChapter(index)}
                                className="px-1 py-1 rounded-full text-white bg-red-500 hover:bg-red-600"
                              >
                                <RiSubtractFill />
                              </button>
                            ) : (
                              <button className="px-1 py-1 rounded-full text-white bg-red-500 hover:bg-red-600 cursor-not-allowed">
                                <RiSubtractFill />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-8 border-l border-r">
                        {plan.weeks.map((week, weekIndex) => (
                          <div class="overflow-hidden grid grid-cols-10 border-t border-b">
                            <div class="col-span-3 px-2 py-2 grid grid-cols-2 border-r text-black">
                              <div>
                                <span>Week {week.weekNumber}</span>
                              </div>
                              <div className="flex items-start justify-end">
                                {plan.weeks.length > 1 ? (
                                  <button
                                    onClick={() => handleRemoveWeek(index, weekIndex)}
                                    className="px-1 py-1 rounded-full text-white bg-red-500 hover:bg-red-600"
                                  >
                                    <RiSubtractFill />
                                  </button>
                                ) : (
                                  <button
                                    disabled
                                    className="px-1 py-1 rounded-full text-white bg-red-500 cursor-not-allowed"
                                  >
                                    <RiSubtractFill />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div class="col-span-7 p-2 topics-container">
                              {week.topics.map((topic, topicIndex) => (
                                <div className="grid grid-flow-col gap-4 topic-template">
                                  <div class="col-span-6 mb-3 grid grid-flow-row gap-2">
                                    <label for="subject" class="form-label">
                                      Topic Name<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      onChange={(e) => {
                                        const updatedPlan = [...plans];
                                        updatedPlan[index].weeks[weekIndex].topics[topicIndex].name = e.target.value;
                                        setPlan(updatedPlan);
                                      }}
                                      value={topic.name}
                                      type="text"
                                      className="w-full rounded-lg h-10 border-gray-300"
                                    />
                                  </div>
                                  <div class="col-span-3 mb-3 grid grid-flow-row gap-2">
                                    <label for="subject" class="form-label">
                                      Duration<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      onChange={(e) => {
                                        const updatedPlan = [...plans];
                                        updatedPlan[index].weeks[weekIndex].topics[topicIndex].duration =
                                          e.target.value;
                                        setPlan(updatedPlan);
                                      }}
                                      value={topic.duration}
                                      type="number"
                                      className="rounded-lg h-10 border-gray-300"
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    {week.topics.length > 1 ? (
                                      <button
                                        onClick={() => handleRemoveTopic(index, weekIndex, topicIndex)}
                                        className="p-1 text-white rounded-full mt-4 bg-red-500 hover:bg-red-600"
                                      >
                                        <RiSubtractFill />
                                      </button>
                                    ) : (
                                      <button className="p-1 text-white rounded-full mt-4 bg-red-500 cursor-not-allowed">
                                        <RiSubtractFill />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => handleAddTopic(index, weekIndex)}
                                type="button"
                                class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md add-topic-btn"
                              >
                                Add Topic
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="px-2 py-2 border-b">
                          <button
                            onClick={() => handleAddWeek(index)}
                            type="button"
                            class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                          >
                            Add Week
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="px-2 py-2">
                    <button
                      onClick={handleAddPlan}
                      type="button"
                      class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                    >
                      Add Chapter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* plan edit */}
        {showUpdatedPlan && (
          <div className="w-full px-4 mb-4 mt-4">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-base font-semibold mb-4 flex items-center justify-start gap-10 p-2">
                <div className="flex items-center justify-start gap-2">
                  <button
                    onClick={() => handleUpdatePlan()}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-check text-yellow-300"></i>Done
                  </button>
                  <button
                    onClick={() => {
                      setCreatePlan(false);
                      setShowUpdatedPlan(false);
                      setPlanEdit({});
                      handleSearchTeachingPlan();
                    }}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-xmark"></i>Close
                  </button>
                </div>
              </div>
              <div className="px-2 py-2 pb-4 flex flex-wrap gap-5">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-24 font-semibold px-2 py-1 bg-gray-400">
                    <span>Năm học</span>
                  </div>
                  <div>
                    <input
                      value={academicYear}
                      className="h-8 rounded w-44 bg-gray-200 text-gray-800 border-none"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="text-lg w-full ">
                <div class="card mb-4 overflow-hidden chapter-container">
                  <div class="px-2 grid grid-cols-10">
                    <div className="col-span-2 py-1 px-2 border-t border-l bg-gray-400">
                      <span className="font-medium">Chapters</span>
                    </div>
                    <div className="col-span-8 grid grid-cols-10">
                      <div className="col-span-3 py-1 px-2 border-t border-l bg-gray-400">
                        <span className="font-medium">Weeks</span>
                      </div>
                      <div className="col-span-7 py-1 px-2 border-t border-r border-l bg-gray-400">
                        <span className="font-medium">Topics</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-body px-2 grid grid-cols-10 chapter-template">
                    <div class="col-span-2 border-l border-b">
                      <div className="border-t px-2 py-2 grid grid-cols-10 gap-2">
                        <div className="col-span-10">
                          <select
                            value={planEdit._id}
                            onChange={(e) => {
                              const updatedPlan = { ...planEdit };
                              updatedPlan._id = e.target.value;
                              setPlanEdit(updatedPlan);
                            }}
                            disabled
                            className="w-full rounded h-10 border"
                          >
                            <option value=""></option>
                            {listSubjects.map((subject) => (
                              <option value={subject.subjectCode}>{subject.subjectName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-8 border-l border-r">
                      {planEdit.week.map((week, weekIndex) => (
                        <div class="overflow-hidden grid grid-cols-10 border-t border-b">
                          <div class="col-span-3 px-2 py-2 grid grid-cols-2 border-r text-black">
                            <div>
                              <span>Week {week.weekNumber}</span>
                            </div>
                            <div className="flex items-start justify-end">
                              {planEdit.week.length > 1 ? (
                                <button
                                  onClick={() => handleRemoveWeekUpdate(weekIndex)}
                                  className="px-1 py-1 rounded-full text-white bg-red-500 hover:bg-red-600"
                                >
                                  <RiSubtractFill />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-1 py-1 rounded-full text-white bg-red-500 cursor-not-allowed"
                                >
                                  <RiSubtractFill />
                                </button>
                              )}
                            </div>
                          </div>
                          <div class="col-span-7 p-2 topics-container">
                            {week.topics.map((topic, topicIndex) => (
                              <div className="grid grid-flow-col gap-4 topic-template">
                                <div class="col-span-4 mb-3 grid grid-flow-row gap-2">
                                  <label for="subject" class="form-label">
                                    Topic Name<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    onChange={(e) => {
                                      const updatedPlan = { ...planEdit };
                                      updatedPlan.week[weekIndex].topics[topicIndex][0].name = e.target.value;
                                      setPlanEdit(updatedPlan);
                                    }}
                                    value={topic[0].name}
                                    type="text"
                                    className="w-full rounded-lg h-10 border-gray-300"
                                  />
                                </div>
                                <div class="col-span-3 mb-3 grid grid-flow-row gap-2">
                                  <label for="subject" class="form-label">
                                    Duration<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    onChange={(e) => {
                                      const updatedPlan = { ...planEdit };
                                      updatedPlan.week[weekIndex].topics[topicIndex][0].duration = e.target.value;
                                      setPlanEdit(updatedPlan);
                                    }}
                                    value={topic[0].duration}
                                    type="number"
                                    min={1}
                                    max={10}
                                    required
                                    className="rounded-lg h-10 border-gray-300"
                                  />
                                </div>
                                <div class="col-span-3 mb-3 grid grid-flow-row gap-2">
                                  <label for="subject" class="form-label">
                                    Process<span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    onChange={(e) => {
                                      const updatedPlan = { ...planEdit };
                                      updatedPlan.week[weekIndex].topics[topicIndex][0].process = e.target.value;
                                      setPlanEdit(updatedPlan);
                                    }}
                                    value={topic[0].process}
                                    type="number"
                                    min={1}
                                    max={100}
                                    required
                                    className="rounded-lg h-10 border-gray-300"
                                  />
                                </div>
                                <div className="flex items-center">
                                  {week.topics.length > 1 ? (
                                    <button
                                      onClick={() => handleRemoveTopicUpdate(weekIndex, topicIndex)}
                                      className="p-1 text-white rounded-full mt-4 bg-red-500 hover:bg-red-600"
                                    >
                                      <RiSubtractFill />
                                    </button>
                                  ) : (
                                    <button className="p-1 text-white rounded-full mt-4 bg-red-500 cursor-not-allowed">
                                      <RiSubtractFill />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddTopicUpdate(weekIndex)}
                              type="button"
                              class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md add-topic-btn"
                            >
                              Add Topic
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="px-2 py-2 border-b">
                        <button
                          onClick={handleAddWeekUpdate}
                          type="button"
                          class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                        >
                          Add Week
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-2">
                    <button
                      onClick={handleAddPlan}
                      type="button"
                      class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                    >
                      Add Chapter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
}
