const express = require("express");
const app = express();
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require("body-parser");
const db = require("./db");
const session = require('express-session');

const port = process.env.PORT || 3003;

const server = app.listen(port, () => {
  console.log(`Server is runing at http://localhost:${port}`);
});

app.set("view engine", "Pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "Tetra",
  resave: true,
  saveUninitialized: false,
}));

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logout = require('./routes/logout');


app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logout);



app.get("/", middleware.requireLogin, (req, res, next) => {

  const payload = {
    pageTitle: "Tetra || Home",
    userLoggedIn: req.session.user
  }

  res.status(200).render("home", payload);
});