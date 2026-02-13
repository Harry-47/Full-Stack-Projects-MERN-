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
  createTokens,
} = require("../controllers/authController");


const {
  registerSchema,
  loginSchema,
  passwordResetSchema,
} = require("../Utils/validationSchemas/authSchemas");
const { validateAuth } = require("../middlewares/validateAuth");
const { loginLimiter, resetLimiter} = require("../Utils/RateLimiters/auth-rateLimit")


const githubStrategy = require("../configs/github-0auth2.0");
const googleStrategy = require("../configs/google-0auth2.0");

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
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/auth/login",
  }),
  async (req, res) => {
    const fingerprint = crypto.randomBytes(32).toString("hex");
    const printHash = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");
    const user = req.user;
    const { accessToken, refreshToken } = createTokens(user, printHash);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: refreshToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax", // development ke liye false
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
      `http://localhost:5173/user/products?isLoggedIn=true&profilePic=${user.profilePic}`,
    ); // ya jo bhi homepage hai
  },
);
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:5173/auth/login",
  }),
  async (req, res) => {
    const fingerprint = crypto.randomBytes(32).toString("hex");
    const printHash = crypto
      .createHash("sha256")
      .update(fingerprint)
      .digest("hex");
    const user = req.user;
    const { accessToken, refreshToken } = createTokens(user, printHash);

    await User.findByIdAndUpdate(user._id, {
      refreshToken: refreshToken,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",// development ke liye false
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
      `http://localhost:5173/user/products?isLoggedIn=true&profilePic=${user.profilePic}`,
    ); 
  },
);

module.exports = router;
