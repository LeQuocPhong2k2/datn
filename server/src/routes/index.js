// nơi lấy all link route api

const accountsRouter = require("./accounts");
const teachersRouter = require("./teachers");
const classesRouter = require("./class");
const studentsRouter = require("./students");
const subjectsRouter = require("./subjects");

function route(app) {
  app.use("/accounts", accountsRouter), app.use("/teachers", teachersRouter), app.use("/class", classesRouter), app.use("/students", studentsRouter), app.use("/subjects", subjectsRouter);
}

module.exports = route;
