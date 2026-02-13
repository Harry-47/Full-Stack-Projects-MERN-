const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require('../models/userSchema');
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/google/callback',
        },
       async (accessToken, refreshToken, profile, done) => {
    try {
        // Find user by Google ID
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            // Agar user pehle se hai, to seedha login karwa do
            console.log('User found:', existingUser.displayName, profile);
            return done(null, existingUser);
        }

        // Agar user nahi hai, to naya user banao
        const newUser = await new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value || profile.picture
        }).save();

        console.log('New user created:', newUser.displayName);
        done(null, newUser);

    } catch (err) {
        // Agar koi error aata hai (jese ke duplicate email), to yahan handle karo
        console.error('Error in Google Strategy:', err);
        // User ko null bhej do aur error de do
        done(err, null);
    }
}
    )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});