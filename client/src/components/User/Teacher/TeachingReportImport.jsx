import React from 'react';
import 'flowbite';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../../UserContext';

export default function TeachingReportImport() {
  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col justify-end gap-2 py-2">
          <input className="border rounded h-10" type="file" />
        </div>
        <div className="flex flex-col justify-end gap-2 py-2">
          <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
