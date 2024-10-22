import 'flowbite';
import React from 'react';
import { useEffect, useState } from 'react';
import { addSubject, findAllSubject, updateSubject, deleteSubject } from '../../../api/Subject';
import { Toaster, toast } from 'react-hot-toast';
import { IoWarningOutline } from 'react-icons/io5';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function AddSubject() {
  const [subjectInfo, setSubjectInfo] = useState({
    subjectName: '',
    subjectCode: '',
    subjectDescription: '',
    subjectCredits: '',
    subjectGrade: '',
    subjectType: '',
  });
  const [subjects, setSubjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeEdit, setActiveEdit] = useState(false);
  const [rowIndex, setRowIndex] = useState(-1);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  useEffect(() => {
    handlePageLoading();
    fetchSubjects();
  }, []);

  const handlePageLoading = () => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  const openModal = (index) => {
    setSubjectToDelete(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSubjectToDelete(null);
    setSubjectInfo({
      subjectName: '',
      subjectCode: '',
      subjectDescription: '',
      subjectCredits: '',
      subjectGrade: '',
      subjectType: '',
    });
  };

  const handleEditClick = (index) => {
    setRowIndex(index);
    setActiveEdit(true);
    setSubjectInfo((prevInfo) => ({
      ...prevInfo,
      rowIndex: index,
      subjectName: subjects[index].subjectName,
      subjectCode: subjects[index].subjectCode,
      subjectDescription: subjects[index].subjectDescription,
      subjectCredits: subjects[index].subjectCredits,
      subjectGrade: subjects[index].subjectGrade,
      subjectType: subjects[index].subjectType,
    }));
  };

  const handleCancelEditClick = (index) => {
    setRowIndex(-1);
    setActiveEdit(false);
    setSubjectInfo({
      subjectName: '',
      subjectCode: '',
      subjectDescription: '',
      subjectCredits: '',
      subjectGrade: '',
      subjectType: '',
    });
  };

  const handleSaveClick = async (index) => {
    if (!validateSubjectInfo()) return;
    try {
      const subjectUpdate = await updateSubject(subjectInfo);
      if (subjectUpdate) {
        toast.success('Cập nhật môn học thành công');
        setActiveEdit(false);
        setSubjectInfo({
          subjectName: '',
          subjectCode: '',
          subjectDescription: '',
          subjectCredits: '',
          subjectGrade: '',
          subjectType: '',
        });
        handlePageLoading();
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleDeleteClick = (index) => {
    setRowIndex(index);
    // setActiveEdit(true);
    setSubjectInfo((prevInfo) => ({
      ...prevInfo,
      rowIndex: index,
      subjectName: subjects[index].subjectName,
      subjectCode: subjects[index].subjectCode,
      subjectDescription: subjects[index].subjectDescription,
      subjectCredits: subjects[index].subjectCredits,
      subjectGrade: subjects[index].subjectGrade,
      subjectType: subjects[index].subjectType,
    }));
    openModal(index);
  };

  const handleSubmitDelete = async (index) => {
    try {
      const subjectDelete = await deleteSubject(subjectInfo.subjectCode);
      if (subjectDelete) {
        toast.success('Xóa môn học thành công');
        setActiveEdit(false);
        setSubjectInfo({
          subjectName: '',
          subjectCode: '',
          subjectDescription: '',
          subjectCredits: '',
          subjectGrade: '',
          subjectType: '',
        });
        closeModal();
        handlePageLoading();
        fetchSubjects();
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const validateSubjectInfo = () => {
    if (!subjectInfo.subjectName) {
      toast.error('Tên môn học không được để trống');
      return false;
    }
    if (!subjectInfo.subjectGrade) {
      toast.error('Khối lớp không được để trống');
      return false;
    }
    if (!subjectInfo.subjectCredits) {
      toast.error('Số tiết học không được để trống');
      return false;
    }
    if (!subjectInfo.subjectType) {
      toast.error('Loại môn học không được để trống');
      return false;
    }
    return true;
  };

  const handleAddSubject = async () => {
    if (!validateSubjectInfo()) return;
    try {
      await addSubject(subjectInfo);
      toast.success('Thêm môn học thành công');
      //clear form
      setSubjectInfo({
        subjectName: '',
        subjectCode: '',
        subjectDescription: '',
        subjectCredits: '',
        subjectGrade: '',
        subjectType: '',
      });
      handlePageLoading();
      fetchSubjects();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const subjects = await findAllSubject();
      setSubjects(subjects);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setSubjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'subjectName' ? value.toUpperCase() : value,
    }));
  };

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Search Teacher"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Change overlay background color here
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'white',
          },
        }}
      >
        <div className="relative p-4 w-full h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-start gap-2 p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <IoWarningOutline className="text-xl text-red-700" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Bạn chắc chắn muốn xóa môn học này?
              </h3>
            </div>

            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <button
                onClick={() => handleSubmitDelete(subjectToDelete)}
                className="text-white inline-flex w-full justify-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                OK
              </button>
              <button
                onClick={closeModal}
                className="text-white inline-flex w-full justify-center bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Toaster toastOptions={{ duration: 2200 }} />
      <div id="root" className="grid grid-flow-row gap-4 p-4 px-20 max-h-full overflow-auto relative">
        <div className="pb-5">
          <span className="text-lg font-medium flex items-center justify-start gap-1">Thêm mới môn học</span>
          <span className="text-sm text-gray-500 font-normal flex items-center justify-start gap-1">
            Chức năng này giúp bạn thêm mới môn học vào hệ thống
          </span>
        </div>
        <div>
          <span className="font-medium">1. Thông tin môn học</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          <div>
            <label htmlFor="tenMonHoc">Tên môn học*</label>
            <input
              type="text"
              id="tenMonHoc"
              value={subjectInfo.subjectName}
              onChange={(e) => handleOnchange(e)}
              name="subjectName"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="khoiLop">Khối lớp*</label>
            <select
              name="subjectGrade"
              id="khoiLop"
              onChange={(e) => handleOnchange(e)}
              value={subjectInfo.subjectGrade}
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="" selected></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label htmlFor="soTiet">Số tiết học*</label>
            <input
              type="text"
              id="soTiet"
              value={subjectInfo.subjectCredits}
              onChange={(e) => handleOnchange(e)}
              name="subjectCredits"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="loaiMonHoc">Loại môn học*</label>
            <select
              value={subjectInfo.subjectType}
              onChange={(e) => handleOnchange(e)}
              name="subjectType"
              id="loaiMonHoc"
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="" selected></option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Năng khiếu">Năng khiếu</option>
              <option value="Ngoại ngữ">Ngoại ngữ</option>
              <option value="Thể chất">Thể chất</option>
            </select>
          </div>
          <div>
            <label htmlFor="moTa">Mô tả</label>
            <input
              type="text"
              id="moTa"
              value={subjectInfo.subjectDescription}
              onChange={(e) => handleOnchange(e)}
              name="subjectDescription"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {activeEdit ? (
            <div>
              <div></div>
              <br />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveClick}
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Câp nhật
                </button>
                <button
                  onClick={() => handleCancelEditClick()}
                  className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div></div>
              <br />
              <button
                onClick={handleAddSubject}
                className=" bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Thêm môn học
              </button>
            </div>
          )}
        </div>
        <div>
          <span className="font-medium">2. Danh sách môn học</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
          <div>
            <label htmlFor="loaiMonHoc">Khối lớp</label>
            <select
              onChange={(e) => handleOnchange(e)}
              name="subjectType"
              id="loaiMonHoc"
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="Tất cả" selected>
                Tất cả
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div>
            <label htmlFor="loaiMonHoc">Loại môn học</label>
            <select
              onChange={(e) => handleOnchange(e)}
              name="subjectType"
              id="loaiMonHoc"
              className="w-full p-2 border border-gray-300 rounded"
              defaultValue=""
            >
              <option value="Tất cả" selected>
                Tất cả
              </option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Năng khiếu">Năng khiếu</option>
              <option value="Ngoại ngữ">Ngoại ngữ</option>
              <option value="Thể chất">Thể chất</option>
            </select>
          </div>
        </div>
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-2 border border-b border-gray-300 text-left w-14">STT</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Tên môn học</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Khối lớp</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Số tiết/năm</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Số tiết/tuần</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Loại môn học</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left">Mô tả</th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left w-16"></th>
                <th className="py-2 px-2 border border-b border-gray-300 text-left w-16"></th>
              </tr>
            </thead>
            <tbody>
              {pageLoading && (
                <div
                  id="root"
                  className="grid grid-flow-row gap-4 p-4 px-10 max-h-full w-full h-full items-center justify-center overflow-auto relative"
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
              {!pageLoading && (
                <>
                  {subjects.map((subject, index) => (
                    <tr
                      key={index}
                      className={`${rowIndex === index ? 'bg-blue-100' : 'bg-white'} group border border-blue-300`}
                    >
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">{index + 1}</td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectName}</td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectGrade}</td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectCredits}</td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">
                        {Math.round(subject.subjectCredits / 35)}
                      </td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">{subject.subjectType}</td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">
                        {subject.subjectDescription}
                      </td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteClick(index)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-2 border border-b border-gray-300 text-left">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
