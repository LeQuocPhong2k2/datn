/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import 'flowbite';
import React from 'react';

import { useState } from 'react';

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
  const [createPlan, setCreatePlan] = useState(false);
  /**
   * Handle functions
   */

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
        {!createPlan && (
          <div className="w-full px-4 mb-4 mt-4 grid grid-cols-10">
            <div className="col-span-3 p-6 bg-white rounded-lg shadow-lg ">
              <div>
                <input className="w-full rounded-md" type="text" placeholder="Search plan..." />
              </div>
              <div className="py-4 flex items-center justify-start gap-2">
                <i class="fa-solid fa-bars"></i>
                <span className="text-xl font-semibold">Plan overview</span>
              </div>
              <div className="py-4 flex items-center justify-start gap-2">
                <button
                  onClick={() => setCreatePlan(true)}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create the plan
                </button>
              </div>
            </div>
          </div>
        )}

        {createPlan && (
          <div className="w-full px-4 mb-4 mt-4">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="text-base font-semibold mb-4 grid grid-flow-col gap-2 p-2">
                <div className="flex items-center justify-start gap-2">
                  <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    <i class="fa-solid fa-check text-yellow-300"></i>Done
                  </button>
                  <button
                    onClick={() => setCreatePlan(false)}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
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
                <div class="card mb-4 overflow-hidden chapter-container">
                  <div class="card-body p-2 grid grid-cols-10">
                    <div class="col-span-3 border-l border-t border-b">
                      <div className="h-10">
                        <label for="subject" class="form-label h-10 px-2 py-1">
                          Subject
                        </label>
                      </div>
                      <div className="border-t px-2 py-2">
                        <select className="w-full rounded h-10 border" name="" id="">
                          <option value=""></option>
                          <option value="">Toán</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-7 border-t border-l border-r">
                      <div className="grid grid-cols-10 items-start h-10">
                        <div className="col-span-3 border-r">
                          <h3 class="mb-3 font-semibold text-xl h-10 px-2 py-1">Weeks</h3>
                        </div>
                        <div className="col-span-7 flex items-start h-10">
                          <h3 class="mb-3 font-semibold text-xl h-10 px-2 py-1">Topic</h3>
                        </div>
                      </div>
                      {weeks.map((week, index) => (
                        <div class="overflow-hidden grid grid-cols-10 border-t border-b">
                          <div class="col-span-3 px-2 py-2 grid grid-cols-2 border-r text-black">
                            <div>
                              <span>Week {week.weekNumber}</span>
                            </div>
                            <div className="flex items-start justify-end">
                              {weeks.length > 1 ? (
                                <button
                                  onClick={() => handleRemoveWeek(index)}
                                  className="px-1 py-1 rounded-full text-white bg-red-500 hover:bg-red-600"
                                >
                                  <RiSubtractFill />
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-1 py-1 rounded-full text-white bg-red-500 cursor-not-allowed"
                                >
                                  <RiSubtractFill />
                                </button>
                              )}
                            </div>
                          </div>
                          <div class="col-span-7 p-2 topics-container">
                            {week.topics.map((topic, topicIndex) => (
                              <div className="grid grid-flow-col gap-4 topic-template">
                                <div class="col-span-6 mb-3 grid grid-flow-row gap-2">
                                  <label for="subject" class="form-label">
                                    Topic Name
                                  </label>
                                  <input
                                    value={topic.name}
                                    type="text"
                                    className="w-full rounded-lg h-10 border-gray-300"
                                  />
                                </div>
                                <div class="col-span-3 mb-3 grid grid-flow-row gap-2">
                                  <label for="subject" class="form-label">
                                    Duration
                                  </label>
                                  <input
                                    value={topic.duration}
                                    type="number"
                                    className="rounded-lg h-10 border-gray-300"
                                  />
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
                      <div className="px-2 py-2 border-b">
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

                  <div className="px-2 py-2">
                    <button
                      onClick={handleAddWeek}
                      type="button"
                      class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md add-topic-btn"
                    >
                      Add Chapter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
}
