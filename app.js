const express = require("express");
const app = express();


const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is runing a http://localhost:${port}`);
});