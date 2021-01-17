const express = require("express");
const app = express();
const middleware = require('./middleware');

const port = process.env.PORT || 3003;

const server = app.listen(port, () => {
  console.log(`Server is runing at http://localhost:${port}`);
});

app.set("view engine", "Pug");
app.set("views", "views");

app.get("/", middleware.requireLogin, (req, res, next) => {

  const payload = {
    pageTitle: "Tetra"
  }

  res.status(200).render("home", payload);
});