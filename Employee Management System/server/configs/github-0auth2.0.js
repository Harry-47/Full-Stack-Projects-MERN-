const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy; 
const { User } = require('../models/userSchema');
require('dotenv').config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/github/callback`,
      scope: ['user:email'] 
    }, 
    async function(accessToken, refreshToken, profile, done) {
      try {
        // 1. Database search using github id
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          console.log("GitHub User found in DB");
          return done(null, user);
        }

        // 2. if new user then save with github id
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        const newUser = new User({
          githubId: profile.id, 
          name: profile.displayName || profile.username,
          email: email,
          profilePic: (profile.photos && profile.photos[0]) ? profile.photos[0].value : null
        });

        await newUser.save();
        console.log("New GitHub User created");
        
        return done(null, newUser);
      } catch (err) {
        console.error('❌ Error in Github Strategy:', err);
        return done(err, null);
      }
    }
  )
);