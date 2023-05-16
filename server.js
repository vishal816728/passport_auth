const express = require("express");
const app = express();
require("dotenv").config();
const { engine } = require("express-handlebars");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const expressSession = require("express-session");
const mongoStore = require("connect-mongo");
var cookieParser = require("cookie-parser");

app.use(cookieParser("secret"));

const { userModel, connectDB } = require("./config/db");
const { initializePassport, isAuthenticated } = require("./passport-config");

initializePassport(passport);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    // store: mongoStore.create({
    //   mongoUrl: "mongodb://0.0.0.0:27017/passport",
    //   collectionName: "sessions",
    // }),
    // cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 7000;

// local databases
connectDB();

app.get("/", (req, res) => {
  res.render("index", { layout: false, name: "vishal" });
});

app.get("/register", (req, res) => {
  res.render("register", { layout: false });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: false });
});

app.post("/register", async (req, res) => {
  let user = new userModel({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  if (user) {
    await user.save();
    res.status(201).redirect("/");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log(req.body);
    console.log(req.session);
  }
);
app.get("/home", isAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.session);
  res.send("Welcome to the Home page you are authenticated");
});
app.get("/logout", (req, res) => {
  res.send("logout");
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
