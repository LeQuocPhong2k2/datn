import React from 'react';
import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';

const ImportSubject = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const [subjectImport, setSubjectImport] = useState([]);
  const [importProgress, setImportProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState({
    success: 0,
    failed: 0,
  });
  const [subjectImportFailed, setsubjectImportFailed] = useState([]);

  useEffect(() => {
    handlePageLoading();
  }, []);

  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  /**
   * handleFileUpload
   * @param {*} event
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setSubjectImport(worksheet);
    };
    reader.readAsArrayBuffer(file);
  };

  /**
   * handleImport
   */
  const handleImport = async () => {
    let totalStudents = subjectImport.length;
    let success = 0;
    let failed = 0;
  };
  return (
    <>
      {pageLoading && (
        <div
          id="root"
          className="grid grid-flow-row gap-4 p-4 px-20 max-h-full w-full h-full items-center justify-center overflow-auto relative"
        >
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-6 h-w-6 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
          </button>
        </div>
      )}
      <div id="root" className="grid grid-flow-row gap-2 p-4 px-10 max-h-full w-full overflow-auto relative">
        <div className="pb-5">
          <span className="text-lg font-medium flex items-center justify-start gap-1">Import danh sách môn học</span>
          <span
            className="
              text-sm text-gray-500 font-normal flex items-center justify-start gap-1
            "
          >
            Trang này dùng để import danh sách môn học từ file excel
          </span>
        </div>
        <div>
          <input type="file" onChange={handleFileUpload} />
          <button
            onClick={handleImport}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Import
          </button>
        </div>
        <div>
          <span>Process: {importProgress}%</span>
        </div>
        <div>
          <span>Thành công: {progressStatus.success}</span>
        </div>
        <div>
          <span>Thất bại: {progressStatus.failed}</span>
        </div>
        <div>
          <span className="font-medium text-red-500 underline underline-offset-2">Danh sách import thất bại</span>
        </div>
      </div>
    </>
  );
};

export default ImportSubject;
