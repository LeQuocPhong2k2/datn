import React from 'react';
import 'flowbite';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import TeachingReportManyDay from './TeachingReportManyDay';
import TeachingReportDay from './TeachingReportDay';

export default function TeachingPlans() {
  const [optionCreate, setOptionCreate] = useState('one-day');

  return (
    <div>
      <div className="mx-4 my-2">
        <div className="flex items-center justify-start gap-4 py-2">
          <div className="flex items-center justify-start gap-1">
            <input
              onChange={(e) => {
                setOptionCreate(e.target.value);
              }}
              value={'one-day'}
              checked={optionCreate === 'one-day'}
              type="radio"
              name="opBaoBai"
            />
            <label htmlFor="">Tạo báo bài một ngày</label>
          </div>
          <div className="flex items-center justify-start gap-1">
            <input onChange={(e) => setOptionCreate(e.target.value)} value={'many-day'} type="radio" name="opBaoBai" />
            <label htmlFor="">Tạo báo bài nhiều ngày</label>
          </div>
          <div className="flex items-center justify-start gap-1">
            <input onChange={(e) => setOptionCreate(e.target.value)} value={'many-week'} type="radio" name="opBaoBai" />
            <label htmlFor="">Tạo báo bài nhiều tuần</label>
          </div>
        </div>

        {optionCreate === 'one-day' && <TeachingReportDay />}

        {optionCreate === 'many-day' && <TeachingReportManyDay />}

        {optionCreate === 'many-week' && (
          <>
            <div className="flex flex-col justify-end gap-2 py-2">
              <span>
                Từ tuần<span className="text-red-500">*</span>
              </span>
              <div>
                <select className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border">
                  <option value="">Tuần 1</option>
                  <option value="">Tuần 2</option>
                  <option value="">Tuần 3</option>
                  <option value="">Tuần 4</option>
                  <option value="">Tuần 5</option>
                  <option value="">Tuần 6</option>
                  <option value="">Tuần 7</option>
                  <option value="">Tuần 8</option>
                  <option value="">Tuần 9</option>
                  <option value="">Tuần 10</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-2 py-2">
              <span>
                Đến tuần<span className="text-red-500">*</span>
              </span>
              <div>
                <select className="w-44 rounded border ring-0 outline-0 focus:ring-0 focus:border">
                  <option value="">Tuần 1</option>
                  <option value="">Tuần 2</option>
                  <option value="">Tuần 3</option>
                  <option value="">Tuần 4</option>
                  <option value="">Tuần 5</option>
                  <option value="">Tuần 6</option>
                  <option value="">Tuần 7</option>
                  <option value="">Tuần 8</option>
                  <option value="">Tuần 9</option>
                  <option value="">Tuần 10</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
