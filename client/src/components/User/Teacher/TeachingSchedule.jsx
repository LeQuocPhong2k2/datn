/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import 'flowbite';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../UserContext';

import Menu from './Menu';

import { checkHomeRoomTeacher } from '../../../api/Class';
import { getScheduleOfHomroomTeacher, getScheduleOfTeacher } from '../../../api/Schedules';

export default function TeachingSchedule() {
  const { user } = useContext(UserContext);
  const [weekDates, setWeekDates] = useState([]);
  const [listSchedule, setListSchedule] = useState([]);
  const [role, setRole] = useState(false);

  useEffect(() => {
    // Get current week's dates
    const getWeekDates = () => {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(monday.getDate() - monday.getDay() + 1); // Get Monday

      const dates = [];
      for (let i = 0; i < 5; i++) {
        // Mon to Fri
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date.toLocaleDateString('vi-VN')); // Vietnamese date format
      }
      return dates;
    };

    setWeekDates(getWeekDates());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phoneTeacher = sessionStorage.getItem('phoneNumberTeacher');
        checkHomeRoomTeacher(phoneTeacher, getCurrentSchoolYear(), user.className)
          .then((res) => {
            setRole(true);
            getScheduleOfHomroomTeacher(user.className, getCurrentSchoolYear()).then((response) => {
              setListSchedule(response.schedules);
            });
          })
          .catch((error) => {
            setRole(false);
            getScheduleOfTeacher(user.teacherId, getCurrentSchoolYear()).then((response) => {
              setListSchedule(response.schedules);
            });
          });
      } catch (error) {
        console.error('Get schedule of teacher error:', error);
      }
    };
    fetchData();
  }, [user.teacherId, user.className]);

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

  function removeNumberFromString(str) {
    return str.replace(/\d+/g, '').trim();
  }

  const createTableData = () => {
    const tableData = [];
    for (let period = 1; period <= 7; period++) {
      const row = [];
      for (let day = 2; day <= 6; day++) {
        let strDay = '';
        switch (day) {
          case 2:
            strDay = 'Monday';
            break;
          case 3:
            strDay = 'Tuesday';
            break;
          case 4:
            strDay = 'Wednesday';
            break;
          case 5:
            strDay = 'Thursday';
            break;
          case 6:
            strDay = 'Friday';
            break;
          default:
            break;
        }

        if (role) {
          const schedule = listSchedule.find((item) => item.day === strDay && item.period === period.toString());
          let strTeacher = '';
          if (schedule) {
            strTeacher = `Gv.${schedule.teacherName}`;
            if (user.userName === schedule.teacherName) {
              strTeacher = '';
            }
          }
          row.push(
            schedule
              ? {
                  subject: removeNumberFromString(schedule.subject),
                  teacherName: strTeacher,
                }
              : ''
          );
        } else {
          const schedule = listSchedule.find((item) => item.day === strDay && item.period === period.toString());
          row.push(
            schedule
              ? {
                  subject: removeNumberFromString(schedule.subject),
                  teacherName: `Lớp: ${schedule.className}`,
                }
              : ''
          );
        }
      }
      tableData.push(row);
    }
    return tableData;
  };

  const tableData = createTableData();
  return (
    <Menu active="teaching-schedule">
      <div className="p-4">
        <div className="rounded shadow bg-white">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i className="fa-regular fa-calendar pr-2"></i>
              LỊCH GIẢNG DẠY
            </h2>
          </div>
          <div className="flex-1 px-4 py-4 flex items-center justify-start text-lg overflow-x-auto overflow-y-auto ">
            <table className="border-collapse border border-gray-400 w-full text-center">
              {/* Header ngang */}
              <thead>
                <tr>
                  <th className="border border-gray-400 bg-gray-200" rowspan="2">
                    TIẾT
                  </th>
                  <th className="border border-gray-400 bg-gray-200" colspan="5">
                    THỨ
                  </th>
                </tr>
                <tr>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">
                    2<div className="text-sm text-gray-600">{weekDates[0]}</div>
                  </th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">
                    3<div className="text-sm text-gray-600">{weekDates[1]}</div>
                  </th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">
                    4<div className="text-sm text-gray-600">{weekDates[2]}</div>
                  </th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">
                    5<div className="text-sm text-gray-600">{weekDates[3]}</div>
                  </th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">
                    6<div className="text-sm text-gray-600">{weekDates[4]}</div>
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <th className="border border-gray-400 bg-gray-100 min-w-16">{index + 1}</th>
                    {row.map((subject, idx) => (
                      <td key={idx} className="border border-gray-300 text-left px-2">
                        <div className="grid grid-rows-2 items-start justify-start">
                          <p className="font-semibold">{subject.subject}</p>
                          <p className="text-base text-gray-600"> {subject.teacherName}</p>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Menu>
  );
}
