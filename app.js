const express = require("express");
const app = express();


const port = process.env.PORT || 3003;

const server = app.listen(port, () => {
  console.log(`Server is runing at http://localhost:${port}`);
});

app.set("view engine", "Pug");
app.set("views", "views");

app.get("/", (req, res, next) => {
  res.status(200).render("home");
});