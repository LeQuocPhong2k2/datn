import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { RiSubtractFill } from 'react-icons/ri';

import Menu from './Menu';

import { saveTeachingPlans, getTeachingPlanByTeacherAndByClassAndBySchoolYear } from '../../../api/TeachingPlan';
import { getHomRoomTeacherCurrent } from '../../../api/Class';
import { getSubjectByGrade } from '../../../api/Subject';

import { Toaster, toast } from 'react-hot-toast';

export default function TeachingPlans() {
  /**
   * State variables
   */

  const [subjects, setSubjects] = useState([]);
  const [listPlans, setListPlans] = useState([]);
  const [teacherInfo, setTeacherInfo] = useState({});
  const [createPlan, setCreatePlan] = useState(false);
  const [plans, setPlan] = useState([
    {
      subject: '',
      className: '',
      academicYear: '',
      weeks: [
        {
          weekNumber: 1,
          topics: [
            {
              name: '',
              duration: 0,
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
    const teacher_phoneNumber = localStorage.getItem('phoneNumberTeacher');
    getHomRoomTeacherCurrent(teacher_phoneNumber)
      .then((res) => {
        setTeacherInfo(res);
        getTeachingPlanByTeacherAndByClassAndBySchoolYear(res.teacher_id, res.className, getCurrentSchoolYear())
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
  }, []);

  const handleOnClickCreatePlan = () => {
    getSubjectByGrade(1)
      .then((data) => {
        console.log(data);
        setSubjects(data);
      })
      .catch((error) => {
        console.error(error);
      });
    setCreatePlan(true);
  };

  const handleAddPlan = () => {
    const newPlan = {
      subject: '',
      className: '',
      weeks: [
        {
          weekNumber: 1,
          topics: [
            {
              name: '',
              duration: 0,
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

  const handleSavePlan = () => {
    // check valid
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

    const teacherPhoneNumber = localStorage.getItem('phoneNumberTeacher');
    if (!teacherPhoneNumber) {
      toast.error('Không tìm thấy thông tin giáo viên');
      return;
    }

    try {
      saveTeachingPlans(plans, teacherPhoneNumber, getCurrentSchoolYear());
      toast.success('Tạo kế hoạch giảng dạy thành công');
      setCreatePlan(false);
      setPlan([
        {
          subject: '',
          className: '',
          academicYear: '',
          weeks: [
            {
              weekNumber: 1,
              topics: [
                {
                  name: '',
                  duration: 0,
                },
              ],
            },
          ],
        },
      ]);
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

  return (
    <Menu active="teaching-plans">
      <Toaster toastOptions={{ duration: 2500 }} />
      <div className="flex flex-wrap">
        {!createPlan && (
          <div className="w-full px-4 mb-4 mt-4 grid grid-cols-12">
            <div className="col-span-7 p-6 bg-white rounded-lg shadow-lg">
              <div className="flex flex-wrap items-center justify-start gap-5 py-4">
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-24 bg-gray-300">
                    <span className="font-semibold">Năm học</span>
                  </div>
                  <select className="h-8 px-2 py-1 rounded w-32" name="" id="">
                    <option value="">2024-2025</option>
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-24 bg-gray-300">
                    <span className="font-semibold">Lớp học</span>
                  </div>
                  <select className="h-8 w-32 px-2 py-1 rounded" name="" id="">
                    <option value="">5A1</option>
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 w-24 bg-gray-300">
                    <span className="font-semibold">Môn học</span>
                  </div>
                  <select className="h-8 w-32 px-2 py-1 rounded" name="" id="">
                    <option value="">5A1</option>
                  </select>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="px-2 py-1 rounded bg-sky-500 hover:bg-sky-600 cursor-pointer text-white">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </div>
                </div>
              </div>
              {/* <div>
                <input className="w-full rounded-md" type="text" placeholder="Search plan..." />
              </div> */}
              <div className="flex items-center justify-start gap-2">
                <i class="fa-solid fa-bars"></i>
                <span className="text-xl font-semibold">Plan overview</span>
              </div>
              <div className="py-4 flex items-center justify-start gap-2">
                <button
                  onClick={handleOnClickCreatePlan}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create the plan
                </button>
              </div>
            </div>
          </div>
        )}

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
                      setPlan([
                        {
                          subject: '',
                          className: '',
                          academicYear: '',
                          weeks: [
                            {
                              weekNumber: 1,
                              topics: [
                                {
                                  name: '',
                                  duration: 0,
                                },
                              ],
                            },
                          ],
                        },
                      ]);
                    }}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    <i class="fa-solid fa-xmark"></i>Close
                  </button>
                </div>
                <div className="flex items-center justify-end gap-5">
                  <button className="flex items-center justify-center gap-2 hover:text-blue-500 hover:ring-1 hover:ring-blue-500 border border-gray-500 py-2 px-4 rounded">
                    <i class="fa-solid fa-file-arrow-down text-yellow-400"></i>Import to excel
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
                      value={getCurrentSchoolYear()}
                      className="h-8 rounded w-52 bg-gray-200 text-gray-800 border-none"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="w-24 font-semibold px-2 py-1 bg-gray-400">
                    <span>
                      Lớp học<span className="text-red-700">*</span>
                    </span>
                  </div>
                  <div className="">
                    <select
                      onChange={(e) => {
                        const updatedPlan = [...plans];
                        updatedPlan[0].className = e.target.value;
                        setPlan(updatedPlan);
                      }}
                      className="h-8 rounded w-52 px-2 py-1"
                      name=""
                      id=""
                      defaultValue={''}
                    >
                      <option value=""></option>
                      <option value="5A1">5A1</option>
                    </select>
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
                              {subjects.map((subject) => (
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
      </div>
    </Menu>
  );
}
