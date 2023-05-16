const { compareSync } = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const { userModel } = require("./config/db");

function initializePassport(passport) {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      let user = await userModel.findOne({ username: username });
      try {
        if (!user) {
          //When username is invalid
          return done(null, false, { message: "Incorrect username." });
        }

        if (!compareSync(password, user.password)) {
          //When password is invalid
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user); //When user is valid
      } catch (err) {
        return done(err, false);
      }
    })
  );
  //Persists user data inside session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  //Fetches session details using session id
  passport.deserializeUser(async function (id, done) {
    try {
      const user = await userModel.findOne({ _id: id });
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  });
}

function isAuthenticated(req, res, next) {
  if (req.user) return next();
  res.redirect("/login");
}

module.exports = { initializePassport, isAuthenticated };
