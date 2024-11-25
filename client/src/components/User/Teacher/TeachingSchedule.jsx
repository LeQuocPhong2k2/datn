import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';

import Menu from './Menu';

import { getScheduleOfTeacher } from '../../../api/Schedules';

export default function TeachingSchedule() {
  const { user } = useContext(UserContext);

  const [listSchedule, setListSchedule] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getScheduleOfTeacher(user.teacherId, getCurrentSchoolYear());
        setListSchedule(response.schedules);
      } catch (error) {
        console.error('Get schedule of teacher error:', error);
      }
    };
    fetchData();
  }, [user.teacherId]);

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
        const schedule = listSchedule.find((item) => item.day === strDay && item.period === period.toString());
        row.push(schedule ? schedule.subject + ' - ' + schedule.className : '');
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
                  <th className="border border-gray-400 bg-gray-100 min-w-32">2</th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">3</th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">4</th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">5</th>
                  <th className="border border-gray-400 bg-gray-100 min-w-32">6</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <th className="border border-gray-400 bg-gray-100 min-w-16">{index + 1}</th>
                    {row.map((subject, idx) => (
                      <td key={idx} className="border border-gray-300 text-left px-10">
                        {subject}
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
