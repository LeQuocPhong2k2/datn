require("dotenv").config({ path: "../../../../.env" });
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");

const ScheduleController = {
  async autoCreateTeacherSchedule(req, res) {
    const { subjectGrade, teacherId } = req.body;
    try {
      //const teacher = await Teacher.findOne({ _id: teacherId });

      const listSubject = await Subject.find({ subjectGrade: 1 });

      const subjects = listSubject.reduce((acc, subject) => {
        const weeklyCredits = subject.subjectCredits / 35;
        acc[subject.subjectName] = Math.round(weeklyCredits);
        return acc;
      }, {});

      const schedule = [];
      const scheduleDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const lessonsPerDay = 2; // Số tiết mỗi buổi (Sáng hoặc Chiều)

      for (const subject in subjects) {
        const totalLessons = subjects[subject];
        const lessons = splitLessons(totalLessons);

        for (const [index, lessonCount] of lessons.entries()) {
          for (let i = 0; i < lessonCount; i++) {
            let randomDay, session, randomLesson, isDuplicate;

            do {
              // Chọn ngẫu nhiên một ngày trong tuần
              randomDay = scheduleDays[Math.floor(Math.random() * scheduleDays.length)];

              // Chọn buổi (Sáng hoặc Chiều)
              session = index === 0 ? "Sáng" : "Chiều";

              // Chọn tiết ngẫu nhiên trong buổi
              randomLesson = Math.floor(Math.random() * lessonsPerDay) + 1;

              // Kiểm tra xem đã có tiết này trong cùng buổi và cùng ngày chưa
              isDuplicate = schedule.some((entry) => entry.scheduleDay === randomDay && entry.session === session && entry.scheduleLesson === randomLesson);
            } while (isDuplicate); // Lặp lại cho đến khi không bị trùng

            // Thêm môn học vào lịch học
            schedule.push({
              scheduleTitle: subject,
              scheduleLesson: randomLesson,
              scheduleSession: session,
              scheduleDays: randomDay,
              scheduleTeacher: "NVA",
            });
          }
        }
      }
      return res.status(201).json({ message: "Auto create teacher schedule successfully", schedule });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

function handleCheckConflictSchedule(listSchedule, Schedule) {
  // check trùng lesson and session
  const isConflict = listSchedule.some((schedule) => {
    return schedule.scheduleLesson.some((lesson) => {
      return Schedule.scheduleLesson.some((newLesson) => {
        return lesson.lesson === newLesson.lesson && lesson.session === newLesson.session;
      });
    });
  });

  if (!isConflict) {
    listSchedule.push(Schedule);
  }

  return listSchedule;
}

function splitLessons(totalLessons) {
  const result = [];
  let remainingLessons = totalLessons;

  while (remainingLessons > 0) {
    const lessonChunk = Math.min(2, remainingLessons);
    result.push(lessonChunk);
    remainingLessons -= lessonChunk;
  }

  return result;
}

module.exports = ScheduleController;
