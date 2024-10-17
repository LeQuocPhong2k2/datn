require("dotenv").config({ path: "../../../../.env" });
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Schedule = require("../models/Schedule");

const ScheduleController = {
  async deleteSchedule(req, res) {
    const { scheduleId } = req.body;
    try {
      await Schedule.deleteOne({ _id: scheduleId });
      return res.status(200).json({ message: "Delete schedule successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getSubjectNotInSchedule(req, res) {
    const { grade } = req.body;
    try {
      const subjects = await Subject.aggregate([
        {
          $match: {
            subjectGrade: grade,
          },
        },
        {
          $lookup: {
            from: "Teacher",
            localField: "subjectType",
            foreignField: "department",
            as: "teachers",
          },
        },
        {
          $project: {
            _id: 1,
            subjectName: 1,
            subjectCode: 1,
            subjectDescription: 1,
            subjectCredits: 1,
            subjectGrade: 1,
            subjectType: 1,
            teachers: {
              _id: 1,
              userName: 1,
            },
          },
        },
      ]);
      const schedules = await Schedule.find();
      const subjectNotInSchedule = subjects.filter((subject) => {
        return !schedules.some((schedule) => schedule.subject.toString() === subject._id.toString());
      });

      console.log(grade);
      console.log(subjectNotInSchedule);

      return res.status(200).json({ subjectNotInSchedule });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getSchedulesByClass(req, res) {
    const { className, schoolYear } = req.body;
    try {
      const schedules = await Schedule.find({ className: className, schoolYear: schoolYear }).populate("subject").populate("scheduleTeacher");
      return res.status(200).json({ schedules });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async createSchedule(req, res) {
    const { scheduleTitle, scheduleTeacher, subjectCode, className, schoolYear, semester1, semester2 } = req.body;
    const timeSlot = req.body.scheduleTimeSlot;
    try {
      const subject = await Subject.findOne({ subjectCode: subjectCode });
      const teacher = await Teacher.findOne({ _id: scheduleTeacher });

      let arrTimeSlot = [];

      timeSlot.forEach((slot) => {
        arrTimeSlot.push({
          lessonNumber: slot.lessonNumber,
          scheduleDay: slot.scheduleDay,
        });
      });

      const schedule = new Schedule({
        schoolYear: schoolYear,
        className: className,
        subject: subject._id,
        scheduleTitle,
        scheduleTeacher: teacher._id,
        semester1: semester1,
        semester2: semester2,
        timesSlot: arrTimeSlot,
      });

      console.log("Đang lưu lịch học...");
      schedule.save();

      return res.status(201).json({ message: "Create schedule successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

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
