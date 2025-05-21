const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require("./../services/user.service");
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "http://localhost:3000/api/v1/users/facebook/callback",
      profileFields: ["id", "email", "name", "picture"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const id = profile.id;
          let user = await userService.findUserByProviderId("facebook",id);
          console.log(user);
        if (!user) {
          user = await userService.createUser({
            name: profile.name.givenName + " " + profile.name.familyName,
            email: profile.emails ? profile.emails[0].value : null,
            provider: "facebook",
            profileId: profile.id,
          });
        }
        return done(null,  user)      
      } 
      catch (error) {
        return done(error);
      }
    }
  )
);



module.exports = passport;
