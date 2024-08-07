const express = require("express");

const app = express();

// Define routes and middleware here

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
