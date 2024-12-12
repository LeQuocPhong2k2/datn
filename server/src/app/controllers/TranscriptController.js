const Transcript = require("../models/Transcript");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Subject = require("../models/Subject");

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
                hk1Gk: "",
                hk1Ck: "",
                hk1Tb: "",
                hk2Gk: "",
                hk2Ck: "",
                hk2Tb: "",
                allYear: "",
                remarks: "",
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

      const classExists = await Class.findOne({
        className: className,
        academicYear: schoolYear,
        studentList: student._id,
      });

      if (!classExists) {
        return res.status(403).json({ message: "Không tìm thấy học sinh trong lớp này" });
      }

      if ((isNaN(gk1) && gk1 !== "") || (isNaN(ck1) && ck1 !== "") || (isNaN(gk2) && gk2 !== "") || (isNaN(ck2) && ck2 !== "")) {
        return res.status(400).json({ message: "Điểm không hợp lệ" });
      }

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

        tbhk1Avg = tinhDiemTrungBinh(parseFloat(gk1), parseFloat(ck1));
        tbhk2Avg = tinhDiemTrungBinh(parseFloat(gk2), parseFloat(ck2));
        tbcnAvg = (tbhk1Avg + tbhk2Avg) / 2;
        tbcnAvg = Math.round(tbcnAvg * 100) / 100;

        transcriptUpdate.userName = student.userName;
        transcriptUpdate.lastName = student.lastName;
        transcriptUpdate.dateOfBirth = student.dateOfBirth;
        transcriptUpdate.hk1Gk = gk1;
        transcriptUpdate.hk1Ck = ck1;
        transcriptUpdate.hk1Tb = !isNaN(tbhk1Avg) ? tbhk1Avg : "";
        transcriptUpdate.hk2Gk = gk2;
        transcriptUpdate.hk2Ck = ck2;
        transcriptUpdate.hk2Tb = !isNaN(tbhk2Avg) ? tbhk2Avg : "";
        transcriptUpdate.allYear = !isNaN(tbcnAvg) ? tbcnAvg : "";
        transcriptUpdate.remarks = remarks;

        await transcriptUpdate.save();
        return res.status(200).json(transcriptUpdate);
      } else {
        let tbhk1Avg = 0;
        let tbhk2Avg = 0;
        let tbcnAvg = 0;

        tbhk1Avg = tinhDiemTrungBinh(parseFloat(gk1), parseFloat(ck1));
        tbhk2Avg = tinhDiemTrungBinh(parseFloat(gk2), parseFloat(ck2));
        tbcnAvg = (tbhk1Avg + tbhk2Avg) / 2;
        tbcnAvg = Math.round(tbcnAvg * 100) / 100;

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
          hk1Tb: !isNaN(tbhk1Avg) ? tbhk1Avg : "",
          hk2Gk: gk2,
          hk2Ck: ck2,
          hk2Tb: !isNaN(tbhk2Avg) ? tbhk2Avg : "",
          allYear: !isNaN(tbcnAvg) ? tbcnAvg : "",
          remarks: remarks,
        });

        await transcript.save();
        return res.status(200).json(transcript);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async checkImportTranscript(req, res) {
    const { mshs, className, schoolYear, subjectCode, gk1, ck1, tbhk1, gk2, ck2, tbhk2, tbcn, remarks } = req.body;

    try {
      const student = await Student.findOne({ studentCode: mshs });

      const classExists = await Class.findOne({
        className: className,
        academicYear: schoolYear,
        studentList: student._id,
      });

      if (!classExists) {
        return res.status(403).json({ message: "Không tìm thấy học sinh trong lớp này" });
      }

      if ((isNaN(gk1) && gk1 !== "") || (isNaN(ck1) && ck1 !== "") || isNaN(gk2) || isNaN(ck2)) {
        console.log(gk1, ck1, gk2, ck2);
        return res.status(400).json({ message: "Điểm không hợp lệ" });
      }

      const transcriptUpdate = await Transcript.findOne({
        studentCode: mshs,
        className: className,
        schoolYear: schoolYear,
        subjectCode: subjectCode,
      });

      if (transcriptUpdate) {
        // await transcriptUpdate.save();
        return res.status(200).json(transcriptUpdate);
      } else {
        // await transcript.save();
        return res.status(200).json(transcript);
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getClassStatistics(req, res) {
    const { className, schoolYear } = req.body;
    console.log(className, schoolYear);
    try {
      const transcripts = await Transcript.aggregate([
        {
          $match: {
            className: className,
            schoolYear: schoolYear,
          },
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subjectCode",
            foreignField: "subjectCode",
            as: "subjectInfor",
          },
        },
        {
          $unwind: "$subjectInfor",
        },
        {
          $project: {
            studentCode: 1,
            userName: 1,
            subjectCode: 1,
            hk1Ck: 1,
            hk2Ck: 1,
            allYear: 1,
            subjectName: "$subjectInfor.subjectName",
          },
        },
      ]);

      // Calculate average score for each student
      const studentDetails = transcripts.reduce((acc, transcript) => {
        const { studentCode, userName, subjectCode, hk1Ck, hk2Ck, allYear, subjectName } = transcript;
        if (!acc[studentCode]) {
          acc[studentCode] = {
            studentCode,
            userName,
            subjects: [],
            totalScore: 0,
            subjectCount: 0,
          };
        }
        acc[studentCode].subjects.push({
          subjectCode,
          hk1Ck,
          hk2Ck,
          allYear,
          subjectName,
        });
        acc[studentCode].totalScore += parseFloat(allYear); // Convert allYear to number before adding
        acc[studentCode].subjectCount += 1;
        return acc;
      }, {});

      // Convert to array and calculate average
      const studentDetailsArray = Object.values(studentDetails).map((student) => ({
        studentCode: student.studentCode,
        userName: student.userName,
        subjects: student.subjects,
        subjectCount: student.subjectCount,
        totalScore: student.totalScore,
        average: Math.round((student.totalScore / student.subjectCount) * 100) / 100,
      }));

      return res.status(200).json({ studentDetails: studentDetailsArray });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getTranscriptByStudentCodeAndClassAndSchoolYear(req, res) {
    const { studentCode, className, schoolYear } = req.body;
    try {
      if (studentCode === undefined || studentCode === "" || studentCode === null) {
        return res.status(200).json([]);
      }

      if (className === undefined || className === "" || className === null) {
        return res.status(200).json([]);
      }

      if (schoolYear === undefined || schoolYear === "" || schoolYear === null) {
        return res.status(200).json([]);
      }

      const transcript = await Transcript.aggregate([
        {
          $match: {
            studentCode: studentCode,
            className: className,
            schoolYear: schoolYear,
          },
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subjectCode",
            foreignField: "subjectCode",
            as: "subjectInfor",
          },
        },
        {
          $unwind: "$subjectInfor",
        },
        {
          $project: {
            studentCode: 1,
            subjectCode: 1,
            hk1Gk: 1,
            hk1Ck: 1,
            hk1Tb: 1,
            hk2Gk: 1,
            hk2Ck: 1,
            hk2Tb: 1,
            allYear: 1,
            remarks: 1,
            subjectName: "$subjectInfor.subjectName",
          },
        },
      ]);

      let điemTrungBinhMonCaNam = 0;
      let count = 0;
      transcript.forEach((element) => {
        điemTrungBinhMonCaNam += element.allYear;
        count++;
      });

      điemTrungBinhMonCaNam = điemTrungBinhMonCaNam / count;
      điemTrungBinhMonCaNam = Math.round(điemTrungBinhMonCaNam * 100) / 100;

      if (transcript) {
        return res.status(200).json({
          transcript: transcript,
          average: điemTrungBinhMonCaNam,
        });
      } else {
        return res.status(200).json({});
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  // thống kê toàn bộ học sinh trong 1 lớp
  // async getClassStatistics(req, res) {
  //   const { className, schoolYear } = req.body
  //   console.log(className, schoolYear)
  //   try {
  //     const transcripts = await Transcript.aggregate([
  //       {
  //         $match: {
  //           className: className,
  //           schoolYear: schoolYear,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'Subject',
  //           localField: 'subjectCode',
  //           foreignField: 'subjectCode',
  //           as: 'subjectInfor',
  //         },
  //       },
  //       {
  //         $unwind: '$subjectInfor',
  //       },
  //       {
  //         $project: {
  //           studentCode: 1,
  //           userName: 1,
  //           subjectCode: 1,
  //           hk1Ck: 1,
  //           hk2Ck: 1,
  //           allYear: 1,
  //           subjectName: '$subjectInfor.subjectName',
  //         },
  //       },
  //     ])

  //     // Calculate average score for each student
  //     const studentDetails = transcripts.reduce((acc, transcript) => {
  //       const {
  //         studentCode,
  //         userName,
  //         subjectCode,
  //         hk1Ck,
  //         hk2Ck,
  //         allYear,
  //         subjectName,
  //       } = transcript
  //       if (!acc[studentCode]) {
  //         acc[studentCode] = {
  //           studentCode,
  //           userName,
  //           subjects: [],
  //           totalScore: 0,
  //           subjectCount: 0,
  //         }
  //       }
  //       acc[studentCode].subjects.push({
  //         subjectCode,
  //         hk1Ck,
  //         hk2Ck,
  //         allYear,
  //         subjectName,
  //       })
  //       acc[studentCode].totalScore += allYear
  //       acc[studentCode].subjectCount += 1
  //       return acc
  //     }, {})

  //     // Convert to array and calculate average
  //     const studentDetailsArray = Object.values(studentDetails).map(
  //       (student) => ({
  //         studentCode: student.studentCode,
  //         userName: student.userName,
  //         subjects: student.subjects,
  //         subjectCount: student.subjectCount,
  //         totalScore: student.totalScore,
  //         average:
  //           Math.round((student.totalScore / student.subjectCount) * 100) / 100,
  //       })
  //     )

  //     return res.status(200).json({ studentDetails: studentDetailsArray })
  //   } catch (error) {
  //     return res.status(500).json({ error: error.message })
  //   }
  // },
  // thống kê toàn bộ học sinh trong 1 lớp

  async getStudentStatistics(req, res) {
    const { studentCode, className, schoolYear } = req.body;
    console.log("Params:", studentCode, className, schoolYear);

    try {
      const transcripts = await Transcript.aggregate([
        {
          $match: {
            studentCode: studentCode,
            className: className,
            schoolYear: schoolYear,
          },
        },
        {
          $lookup: {
            from: "Subject",
            localField: "subjectCode",
            foreignField: "subjectCode",
            as: "subjectInfo",
          },
        },
        {
          $unwind: "$subjectInfo",
        },
        {
          $project: {
            studentCode: 1,
            userName: 1,
            subjectCode: 1,
            hk1Gk: 1,
            hk1Ck: 1,
            hk1Tb: 1,
            hk2Gk: 1,
            hk2Ck: 1,
            hk2Tb: 1,
            allYear: 1,
            subjectName: "$subjectInfo.subjectName",
          },
        },
      ]);

      // Tính toán thống kê chi tiết cho học sinh
      const studentStats = {
        studentInfo: {
          studentCode: transcripts[0]?.studentCode,
          userName: transcripts[0]?.userName,
        },
        subjects: transcripts.map((transcript) => ({
          subjectCode: transcript.subjectCode,
          subjectName: transcript.subjectName,
          scores: {
            hk1: {
              giuaKy: transcript.hk1Gk,
              cuoiKy: transcript.hk1Ck,
              trungBinh: transcript.hk1Tb,
            },
            hk2: {
              giuaKy: transcript.hk2Gk,
              cuoiKy: transcript.hk2Ck,
              trungBinh: transcript.hk2Tb,
            },
            canam: transcript.allYear,
          },
        })),
        statistics: {
          totalSubjects: transcripts.length,
          averageScore: Math.round((transcripts.reduce((sum, t) => sum + t.allYear, 0) / transcripts.length) * 100) / 100,
          scoreRanges: {
            excellent: transcripts.filter((t) => t.allYear >= 9).length,
            good: transcripts.filter((t) => t.allYear >= 7 && t.allYear < 9).length,
            average: transcripts.filter((t) => t.allYear >= 5 && t.allYear < 7).length,
            belowAverage: transcripts.filter((t) => t.allYear < 5).length,
          },
          subjectPerformance: {
            improved: transcripts.filter((t) => t.hk2Tb > t.hk1Tb).length,
            declined: transcripts.filter((t) => t.hk2Tb < t.hk1Tb).length,
            stable: transcripts.filter((t) => t.hk2Tb === t.hk1Tb).length,
          },
          semesterComparison: {
            hk1Average: Math.round((transcripts.reduce((sum, t) => sum + t.hk1Tb, 0) / transcripts.length) * 100) / 100,
            hk2Average: Math.round((transcripts.reduce((sum, t) => sum + t.hk2Tb, 0) / transcripts.length) * 100) / 100,
          },
        },
      };

      return res.status(200).json(studentStats);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

function tinhDiemTrungBinh(gk1, ck1) {
  // Chuyển đổi chuỗi thành số thực
  gk1 = parseFloat(gk1);
  ck1 = parseFloat(ck1);

  // Tính điểm trung bình theo công thức
  let diemTrungBinh = (gk1 * 2 + ck1 * 3) / 5;

  // Làm tròn điểm trung bình đến 2 chữ số thập phân
  diemTrungBinh = Math.round(diemTrungBinh * 100) / 100;

  return diemTrungBinh;
}

module.exports = TranscriptController;
