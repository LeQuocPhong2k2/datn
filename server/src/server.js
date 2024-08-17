const express = require("express");

const app = express();

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://mongo:27017/db_datn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Node.js server!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
