/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import 'flowbite';
import { useState } from 'react';
import Menu from './Menu';
import AttendanceReport2 from './AttendanceReport2';
import AcademicReport from './AcademicReport';

export default function Report() {
  const [activeTab, setActiveTab] = useState('attendance2'); // Set default tab to 'attendance2'

  useEffect(() => {
    // This effect will run once when the component mounts, setting the default tab
    setActiveTab('attendance2');
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Menu active="report">
      <div className="p-4">
        <div className="rounded shadow bg-white">
          {/* Header */}
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i className="fa-solid fa-chart-pie mr-2"></i>
              THỐNG KÊ
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'attendance2'
                      ? 'text-blue-600 border-blue-600'
                      : 'hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => handleTabChange('attendance2')}
                >
                  Điểm Danh
                </a>
              </li>
              <li className="mr-2">
                <a
                  href="#"
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'academic'
                      ? 'text-blue-600 border-blue-600'
                      : 'hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => handleTabChange('academic')}
                >
                  Kết Quả Học Tập
                </a>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'attendance2' && <AttendanceReport2 />}
            {activeTab === 'academic' && <AcademicReport />}
          </div>
        </div>
      </div>
    </Menu>
  );
}
