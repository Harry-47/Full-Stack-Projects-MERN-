const express = require("express");
const router = express.Router();
const passport = require("passport");
const crypto = require("crypto");
const { User } = require("../models/userSchema");

const {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  forgotPassword,
  refreshToken,
  getMe
} = require("../controllers/authController");

const {checkToken, createTokens} = require('../middlewares/RBAC/accessControl')
const {
  registerSchema,
  loginSchema,
  passwordResetSchema,
} = require("../middlewares/validationSchemas/authSchemas");
const { validateAuth } = require("../middlewares/validateAuth");
const { loginLimiter, resetLimiter} = require("../middlewares/RateLimiters/auth-rateLimit")


const githubStrategy = require("../configs/github-0auth2.0");


router.get('/me', checkToken, getMe);
router.post("/register", validateAuth(registerSchema),  registerUser);
router.post("/login", loginLimiter, validateAuth(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  resetLimiter,
  validateAuth(passwordResetSchema),
  resetPassword,
);
router.post("/refresh", refreshToken);
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
  }),
  async (req, res) => {
    const fingerprint = crypto.randomBytes(32).toString("hex");
    const printHash = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");
    const user = req.user;
    console.log(user.name)
    const { accessToken, refreshToken } = createTokens(user, printHash);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: refreshToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/api/v1/auth/refresh",
    });

    res.cookie("fingerprint", fingerprint, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    res.redirect(
      `${process.env.CLIENT_URL}?isLoggedIn=true&profilePic=${user.profilePic}&role=${user.role}&name=${user.name}&email=${user.email}`,
    ); 
  },
);

module.exports = router;
