const express = require("express");
const app = express();
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require("body-parser");

const port = process.env.PORT || 3003;

const server = app.listen(port, () => {
  console.log(`Server is runing at http://localhost:${port}`);
});

app.set("view engine", "Pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use("/login", loginRoute);
app.use("/register", registerRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {

  const payload = {
    pageTitle: "Tetra"
  }

  res.status(200).render("home", payload);
});