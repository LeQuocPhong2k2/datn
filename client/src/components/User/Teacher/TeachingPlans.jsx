import React from 'react';
import 'flowbite';

import { useEffect, useState, useRef } from 'react';

import { IoIosAdd } from 'react-icons/io';
import { RiSubtractFill } from 'react-icons/ri';

import Menu from './Menu';

export default function TeachingPlans() {
  /**
   * State variables
   */
  const [teachingPlans, setTeachingPlans] = useState([]);
  const [plan, setPlan] = useState({
    subject: '',
    className: '',
    academicYear: '',
    weeks: [],
  });
  const [weeks, setWeeks] = useState([
    {
      weekNumber: 1,
      topics: [
        {
          name: 'Topic 1',
          duration: 0,
        },
      ],
    },
  ]);

  const [newTopic, setNewTopic] = useState({
    name: '',
    duration: 0,
  });

  const handleAddWeek = () => {
    const newWeek = {
      weekNumber: weeks.length + 1,
      topics: [
        {
          name: '',
          duration: 0,
        },
      ],
    };
    setWeeks([...weeks, newWeek]);
  };

  const handleAddTopic = (weekIndex) => {
    const updatedWeeks = [...weeks];
    const newTopic = {
      name: '',
      duration: 0,
    };
    updatedWeeks[weekIndex].topics.push(newTopic);
    setWeeks(updatedWeeks);
  };

  const handleRemoveTopic = (weekIndex, topicIndex) => {
    const updatedWeeks = [...weeks];
    updatedWeeks[weekIndex].topics = updatedWeeks[weekIndex].topics.filter((_, index) => index !== topicIndex);
    setWeeks(updatedWeeks);
  };

  const handleRemoveWeek = (weekIndex) => {
    const updatedWeeks = weeks.filter((_, index) => index !== weekIndex);
    setWeeks(updatedWeeks);
  };

  return (
    <Menu active="teaching-plans">
      <div className="flex flex-wrap">
        <div className="w-full px-4 mb-4 mt-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-base font-semibold mb-4 grid grid-flow-col gap-2 p-2">
              <div className="flex items-center justify-start gap-2">
                <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  <i class="fa-solid fa-check text-yellow-300"></i>Done
                </button>
                <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  <i class="fa-solid fa-xmark"></i>Close
                </button>
              </div>
              <div className="flex items-center justify-end gap-5">
                <button className="flex items-center justify-center gap-2 hover:text-sky-700">
                  <i class="fa-solid fa-file-arrow-down text-yellow-400"></i>Import to excel
                </button>
              </div>
            </div>
            <div className="text-lg w-full ">
              <div class="card mb-4 border rounded-lg overflow-hidden">
                <div class="card-header p-2 bg-blue-600 text-white">General Information</div>
                <div class="card-body p-2">
                  <div class="mb-3 grid grid-flow-row gap-2">
                    <label for="subject" class="form-label">
                      Subject
                    </label>
                    <select className="rounded-lg h-10 border-gray-300" name="" id="">
                      <option value=""></option>
                      <option value="">Toán</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="mb-3 font-semibold text-xl">Weeks</h3>
                {weeks.map((week, index) => (
                  <div class="card mb-4 border rounded-lg overflow-hidden">
                    <div class="grid grid-cols-2 p-2 bg-gray-500 text-white">
                      <div>
                        <span>Week {week.weekNumber}</span>
                      </div>
                      <div className="flex items-center justify-end">
                        {weeks.length > 1 ? (
                          <button
                            onClick={() => handleRemoveWeek(index)}
                            className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600"
                          >
                            Remove Week
                          </button>
                        ) : (
                          <button disabled className="px-2 py-1 rounded-md bg-red-500 cursor-not-allowed">
                            Remove Week
                          </button>
                        )}
                      </div>
                    </div>
                    <div class="card-body p-2 topics-container">
                      <span className="font-semibold text-xl">Topics</span>
                      {week.topics.map((topic, topicIndex) => (
                        <div className="grid grid-flow-col gap-4 topic-template">
                          <div class="col-span-6 mb-3 grid grid-flow-row gap-2">
                            <label for="subject" class="form-label">
                              Topic Name
                            </label>
                            <input value={topic.name} type="text" className="w-full rounded-lg h-10 border-gray-300" />
                          </div>
                          <div class="col-span-3 mb-3 grid grid-flow-row gap-2">
                            <label for="subject" class="form-label">
                              Duration
                            </label>
                            <input value={topic.duration} type="number" className="rounded-lg h-10 border-gray-300" />
                          </div>
                          <div className="flex items-center">
                            {week.topics.length > 1 ? (
                              <button
                                onClick={() => handleRemoveTopic(index, topicIndex)}
                                className="h-10 px-4 text-white py-1 mt-4 rounded-md bg-red-500 hover:bg-red-600"
                              >
                                <i class="fa-solid fa-xmark"></i>
                              </button>
                            ) : (
                              <button className="h-10 px-4 text-white py-1 mt-4 rounded-md bg-red-500 cursor-not-allowed">
                                <i class="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddTopic(index)}
                        type="button"
                        class="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md add-topic-btn"
                      >
                        Add Topic
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleAddWeek}
                  type="button"
                  class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                >
                  Add Week
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Menu>
  );
}
