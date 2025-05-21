const passport = require('passport');
const userService = require('../services/user.service');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://127.0.0.1:3000/api/v1/users/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
        try {
          let user = await userService.findUserByProviderId("google",profile.id);
          
          if (!user) {
            user = await userService.createUser({
              name: profile.name.givenName + " " + profile.name.familyName,
              email: profile.emails ? profile.emails[0].value : null,
              provider: "google",
              profileId: profile.id,
            });
            }
                      

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
    )
);