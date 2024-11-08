require("dotenv").config({ path: "../../../../.env" });

const Transcript = require("../models/Transcript");
const Student = require("../models/Student");
const Class = require("../models/Class");

const TranscriptController = {
  /**
   *
   *
   *
   *
   * @author PhongLQ6
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async getTranscriptBySubjectAndClassAndSchoolYear(req, res) {
    const { subjectCode, className, schoolYear, grade } = req.body;
    try {
      if (subjectCode === undefined || subjectCode === "" || subjectCode === null) {
        return res.status(200).json([]);
      }

      if (className === undefined || className === "" || className === null) {
        return res.status(200).json([]);
      }

      if (schoolYear === undefined || schoolYear === "" || schoolYear === null) {
        return res.status(200).json([]);
      }

      if (grade === undefined || grade === "" || grade === null) {
        return res.status(200).json([]);
      }

      const classInfo = await Class.findOne({
        className: className,
        academicYear: schoolYear,
        grade: grade.toString(),
      }).populate("studentList");

      if (classInfo && classInfo.studentList.length > 0) {
        const students = classInfo.studentList.map((student) => ({
          studentCode: student.studentCode,
          userName: student.userName,
          dateOfBirth: student.dateOfBirth,
          lastName: student.lastName,
        }));
        const transcripts = await Transcript.find({
          studentCode: { $in: students.map((s) => s.studentCode) },
          subjectCode: subjectCode,
        });

        const transcriptMap = transcripts.reduce((acc, transcript) => {
          acc[transcript.studentCode] = transcript;
          return acc;
        }, {});

        const result = students.map((student) => {
          return transcriptMap[student.studentCode]
            ? transcriptMap[student.studentCode]
            : {
                studentCode: student.studentCode,
                userName: student.userName,
                lastName: student.lastName,
                className: classInfo.className,
                dateOfBirth: student.dateOfBirth,
                subjectCode: subjectCode,
                hk1Gk: 0,
                hk1Ck: 0,
                hk1Tb: 0,
                hk2Gk: 0,
                hk2Ck: 0,
                hk2Tb: 0,
                allYear: 0,
                remarks: "Chưa có bảng điểm",
              };
        });

        result.sort((a, b) => {
          const catching = a.lastName.localeCompare(b.lastName);
          if (catching === 0) {
            return a.userName.localeCompare(b.userName);
          } else {
            return catching;
          }
        });

        return res.status(200).json(result);
      } else {
        return res.status(200).json([]);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   *
   *
   *
   *
   * @author PhongLQ6
   * @param {*} req
   * @param {*} res
   */
  async updateTranscript(req, res) {
    const { mshs, className, schoolYear, subjectCode, gk1, ck1, tbhk1, gk2, ck2, tbhk2, tbcn, remarks } = req.body;

    try {
      const student = await Student.findOne({ studentCode: mshs });

      const transcriptUpdate = await Transcript.findOne({
        studentCode: mshs,
        className: className,
        schoolYear: schoolYear,
        subjectCode: subjectCode,
      });

      if (transcriptUpdate) {
        let tbhk1Avg = 0;
        let tbhk2Avg = 0;
        let tbcnAvg = 0;

        tbhk1Avg = (gk1 * 2 + ck1 * 3) / 5;
        console.log(gk1);
        console.log(ck1);
        console.log(tbhk1Avg);
        tbhk2Avg = (parseInt(gk2) * 2 + parseInt(ck2) * 3) / 5;
        tbcnAvg = (tbhk1Avg + tbhk2Avg) / 2;

        transcriptUpdate.userName = student.userName;
        transcriptUpdate.lastName = student.lastName;
        transcriptUpdate.dateOfBirth = student.dateOfBirth;
        transcriptUpdate.hk1Gk = gk1;
        transcriptUpdate.hk1Ck = ck1;
        transcriptUpdate.hk1Tb = tbhk1Avg.toFixed(2);
        transcriptUpdate.hk2Gk = gk2;
        transcriptUpdate.hk2Ck = ck2;
        transcriptUpdate.hk2Tb = tbhk2Avg.toFixed(2);
        transcriptUpdate.allYear = tbcnAvg.toFixed(2);
        transcriptUpdate.remarks = remarks;

        await transcriptUpdate.save();
        return res.status(200).json(transcriptUpdate);
      } else {
        let tbhk1Avg = 0;
        let tbhk2Avg = 0;
        let tbcnAvg = 0;

        tbhk1Avg = (parseInt(gk1) * 2 + parseInt(ck1) * 3) / 5;
        tbhk2Avg = (parseInt(gk2) * 2 + parseInt(ck2) * 3) / 5;
        tbcnAvg = (tbhk1Avg + tbhk2Avg) / 2;

        const transcript = new Transcript({
          userName: student.userName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          studentCode: mshs,
          className: className,
          schoolYear: schoolYear,
          subjectCode: subjectCode,
          hk1Gk: gk1,
          hk1Ck: ck1,
          hk1Tb: tbhk1Avg.toFixed(2),
          hk2Gk: gk2,
          hk2Ck: ck2,
          hk2Tb: tbhk2Avg.toFixed(2),
          allYear: tbcnAvg.toFixed(2),
          remarks: remarks,
        });

        await transcript.save();
        return res.status(200).json(transcript);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = TranscriptController;
