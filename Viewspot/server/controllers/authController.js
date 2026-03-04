const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const crypto = require('crypto');
const {User} = require("../models/userSchema");
const { sendEmail } = require("../Utils/nodemailerConfig");

// ================== VALIDATION RULES ================== //

exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
];

exports.loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.passwordResetValidation = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// ================== HELPER: TOKEN CREATOR ================== //

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

// ================== MIDDLEWARE: CHECK TOKEN ================== //
exports.checkToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ error: "Unauthorized - token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches cookie to req.user
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

exports.getUserID = (req, res) => {
  res.status(200).json({ userId: req.user.id });
}
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

   

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User saved successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
};



// ================== LOGIN ================== //

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(405).json({ error: "No User Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ✅ true in production
      maxAge: 3 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.status(200).json({
      message: "✅ Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================== LOGOUT ================== //

exports.logoutUser = async (req, res) => {

  try {
        // Use the exact same options to clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            maxAge: 3 * 24 * 60 * 60 * 1000, 
            path: '/'
 // Match the secure option from login
        });
        res.status(200).json({ message: "🚪 Logged out successfully"});
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
    }
};

// ================== FORGOT PASSWORD ================== //
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with that email does not exist.' });
        }

        // Generate a reset token (20 bytes converted to hex)
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Save hashed token and expiry date to the user model
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Frontend URL where the user will be redirected
        const resetUrl = `http://localhost:5173/auth/reset-password/${resetToken}`;

        const emailContent = `
            <h1>Password Reset Request</h1>
            <p>You are receiving this because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <p>This link is valid for 1 hour.</p>
        `;

        const result = await sendEmail(email, 'Password Reset', emailContent);

        res.status(200).json({ message: 'Password reset link sent to your email.',
          emailResult: result
         });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending password reset email.' });
    }
};

// ================== RESET PASSWORD ================== //
exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;
  

    try {
        // Find the user with the token and check for expiry
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const user = await User.findOne({ 
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiry
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.Redirecting to login page...' });

    } catch (error) {
        
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

