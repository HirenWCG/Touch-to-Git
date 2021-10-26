const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const saltedSha512 = require("salted-sha512");

const userModel = require("./models/userModel");

function encryption(pwd) {
  return saltedSha512(pwd, "SUPER-S@LT!");
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },

    (email, password, done) => {
      userModel
        .findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "email or password invalid!!",
            });
          }

          if (user.password != encryption(password)) {
            return done(null, false, {
              message: "email or password invalid!!",
            });
          }

          done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  userModel
    .findById(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err));
});
