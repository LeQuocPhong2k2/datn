// nơi lấy all link route api

const accountsRouter = require("./accounts");
const teachersRouter = require("./teachers");
const classesRouter = require("./class");

function route(app) {
  app.use("/accounts", accountsRouter), app.use("/teachers", teachersRouter), app.use("/class", classesRouter);
}

module.exports = route;
