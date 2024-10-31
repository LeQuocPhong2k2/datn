// nơi lấy all link route api

const accountsRouter = require("./accounts");
const teachersRouter = require("./teachers");
const classesRouter = require("./class");
const studentsRouter = require("./students");
const subjectsRouter = require("./subjects");
const leaveRequestRouter = require("./leaveRequest");
const schedulesRouter = require("./schedules");
function route(app) {
  app.use("/accounts", accountsRouter), app.use("/teachers", teachersRouter), app.use("/class", classesRouter), app.use("/students", studentsRouter), app.use("/subjects", subjectsRouter), app.use("/leaveRequest", leaveRequestRouter), app.use("/schedules", schedulesRouter);
}

module.exports = route;
