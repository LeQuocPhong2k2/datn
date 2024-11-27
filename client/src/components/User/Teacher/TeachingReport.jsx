import React from 'react';
import 'flowbite';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import Menu from './Menu';
import { Toaster } from 'react-hot-toast';

import TeachingReportCreate from './TeachingReportTabCreate';

export default function TeachingReport() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <Menu active="teaching-report">
      <Toaster toastOptions={{ duration: 2500 }} />
      <div className="p-4">
        <div className="rounded shadow bg-white pb-2">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i class="fa-solid fa-briefcase mr-2"></i>
              BÁO BÀI
            </h2>
          </div>
          <div class="mx-4 text-lg font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul class="flex flex-wrap -mb-px">
              <li onClick={() => setActiveTab('create')} class="me-2 cursor-pointer">
                <span
                  className={`block p-4 border-b-2 ${activeTab === 'create' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                  inline
                  aria-current="page"
                >
                  Tạo báo bài
                </span>
              </li>
              <li onClick={() => setActiveTab('view')} class="me-2 cursor-pointer">
                <span
                  className={`block p-4 border-b-2 ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                >
                  Xem & Chỉnh sửa báo bài
                </span>
              </li>
            </ul>
          </div>

          {activeTab === 'create' && <TeachingReportCreate />}
        </div>
      </div>
    </Menu>
  );
}
