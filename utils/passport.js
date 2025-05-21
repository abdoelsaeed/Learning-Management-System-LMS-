const passport = require("passport");
const userService = require("./../services/user.service");

// توصيل الاستراتيجيات
require("./passportFacebook");
require("./passportGoogle");

// تهيئة serializeUser و deserializeUser
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
