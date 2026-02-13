const passport = require('passport');
// ✅ passport-github2 use karo (behtar hai)
const GitHubStrategy = require('passport-github2').Strategy; 
const { User } = require('../models/userSchema');
require('dotenv').config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
      scope: ['user:email'] // GitHub ke liye ye scope lazmi hai
    }, 
    async function(accessToken, refreshToken, profile, done) {
      try {
        // 1. Database mein githubId se dhoondo
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          console.log("GitHub User found in DB");
          return done(null, user);
        }

        // 2. Agar naya user hai, toh githubId ke sath save karo
        // Profile objects mein emails array check karna parta hai
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        const newUser = new User({
          githubId: profile.id, // ✅ Correct field
          displayName: profile.displayName || profile.username,
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