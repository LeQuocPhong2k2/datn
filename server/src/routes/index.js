// nơi lấy all link route api

const accountsRouter = require("./accounts");
const teachersRouter = require("./teachers");

function route(app) {
  app.use("/accounts", accountsRouter), app.use("/teachers", teachersRouter);
}

module.exports = route;
