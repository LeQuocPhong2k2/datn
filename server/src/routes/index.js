const accountsRouter = require("./accounts");
const teachersRouter = require("./teachers");
const classesRouter = require("./class");
const studentsRouter = require("./students");
const subjectsRouter = require("./subjects");
const leaveRequestRouter = require("./leaveRequest");
const schedulesRouter = require("./schedules");
const attendanceRouter = require("./attendance");
function route(app) {
  app.use("/accounts", accountsRouter), app.use("/teachers", teachersRouter), app.use("/class", classesRouter), app.use("/students", studentsRouter), app.use("/subjects", subjectsRouter), app.use("/leaveRequest", leaveRequestRouter), app.use("/schedules", schedulesRouter);
  app.use("/attendance", attendanceRouter);
}

module.exports = route;
