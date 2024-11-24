import React from 'react';
import 'flowbite';
import { useEffect, useState, useRef } from 'react';

import Menu from './Menu';

export default function Report() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const searchInput = useRef();

  return (
    <Menu active="report">
      <div className="p-4">
        <div className="rounded shadow bg-white ">
          <div className="px-4 py-2 border-b">
            <h2 className="text-xl font-bold" style={{ color: '#0B6FA1' }}>
              <i class="fa-solid fa-chart-pie mr-2"></i>
              THỐNG KÊ
            </h2>
          </div>
        </div>
      </div>
    </Menu>
  );
}
