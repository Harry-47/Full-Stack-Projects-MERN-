const express = require("express");
const router = express.Router();
const passport = require('passport');

const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword,
  registerValidation,
  loginValidation,
  forgotPassword,
  getUserID,
  checkToken
  
} = require("../controllers/authController");
const passportConfig = require("../Utils/passportConfig"); 

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );
};

router.get("/check", checkToken, getUserID);
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/logout", logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/auth/login' }),
    (req, res) => {
       
        const user = req.user;
        const token = generateToken(user); 
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // development ke liye false
            maxAge: 3 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        res.redirect(`http://localhost:5173/user/:${token.id}`); // ya jo bhi homepage hai
    }
);

module.exports = router;