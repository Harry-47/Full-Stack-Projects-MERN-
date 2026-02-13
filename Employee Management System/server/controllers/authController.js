const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const crypto = require('crypto');
const {User} = require("../models/userSchema");
const { sendEmail } = require("../configs/nodemailerConfig");
const { createTokens, checkToken } = require("../middlewares/RBAC/accessControl");
// ================== REGISTER USER ================== //

exports.registerUser = async (req, res) => {
  const { name, email, password, category, role, number, bio, isOAuth } = req.body;

  try {
    // 1. Manager Check 
    if (role === 'manager') {
      const existingAdmin = await User.findOne({ role: 'manager' });
      
      if (existingAdmin && existingAdmin.email !== email) {
        return res.status(400).json({ 
          success: false, 
          msg: "Manager already exists! Only one manager allowed.", 
          data: [] 
        });
      }
    }

    // SCENARIO A: OAuth User (Update Profile)
    if (isOAuth) {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          msg: "Account not found. Please login with GitHub/Google first.", 
          data: [] 
        });
      }

      // update only fields that came after oAuth 
      user.role = role;
      user.number = number;
      user.bio = bio;
      if (category) user.category = category;
      // OAuth does not set users password, user will do it manually on signup or login form
      
      await user.save();

      return res.status(200).json({
        success: true,
        msg: "Profile completed successfully!",
        data: [{ id: user._id, name: user.name, email: user.email, role: user.role }]
      });
    } 

    // SCENARIO B: Standard User (Create New)
    else {
      // Check duplicate email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          msg: "User already exists with this email", 
          data: [] 
        });
      }

      if (!password) {
        return res.status(400).json({ success: false, msg: "Password is required" });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create New Document
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        category,
        number,
        bio
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        msg: "User registered successfully",
        data: [{
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }],
      });
    }

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ 
      success: false, 
      msg: error.message || "Internal Server Error", 
      data: [] 
    });
  }
};


// ================== LOGIN ================== //

exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ 
        success: false, 
        msg: "No User Found", 
        data: [] 
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ 
        success: false, 
        msg: "Invalid email or password", 
        data: [] 
      });

    const fingerprint = crypto.randomBytes(32).toString('hex');

    const printHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    const {accessToken, refreshToken} = createTokens(user, printHash);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // ✅ true in production
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/api/v1/auth/refresh'
    })

    res.cookie('fingerprint', fingerprint, {
      httpOnly: true,
      secure: false,
      path: '/'
    })

    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });


    res.status(200).json({
      success: true,
      msg: "✅ Login successful",
      data: {
        id: user._id,
        role: user.role,
        name: user.name,
        profilePic: user.profilePic
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false, 
      msg: "Server error", 
      data: [] 
    });
  }
};

// ================== LOGOUT ================== //

exports.logoutUser = async (req, res) => {
  
  let isLoggedOut = false;

  try {
        // Use the exact same options to clear the cookie
        res.clearCookie(`accessToken`, {
            httpOnly: true,
            secure: false,
            maxAge: 3 * 24 * 60 * 60 * 1000, 
            path: '/'
 // Match the secure option from login
        });

        res.clearCookie(`refreshToken`, {
            httpOnly: true,
            secure: false,
            path: '/refresh' // Match the secure option from login
        });

        res.clearCookie('fingerprint', {
            httpOnly: true,
            secure: false,
        });

        isLoggedOut = true
        res.status(200).json({ 
          success: true, 
          msg: "🚪 Logged out successfully", 
          data: [{ isLoggedOut }] 
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ 
          success: false, 
          msg: "Logout failed", 
          data: [] 
        });
    }
};

// ================== REFRESH TOKEN ================== //

exports.refreshToken = async (req, res) => {
  const { refreshToken, fingerprint } = req.cookies; 

  if (!refreshToken || !fingerprint) {
    return res.status(401).json({ 
      success: false, 
      msg: "Unauthorized - missing data", 
      data: [] 
    });
  }

  try {
    // 1. Token verify karo
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 2. Validate Token against DB
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ 
        success: false, 
        msg: "Forbidden - Token revoked or invalid", 
        data: [] 
      });
    }

    // 3.Create new fingerprint hash
    const printHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    // 4. Naye tokens banao (PASS THE USER OBJECT FROM DB)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(user, printHash);

    // 5. Set cookies
    res.cookie("accessToken", newAccessToken, { httpOnly: true, path: '/' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, path: '/api/v1/auth/refresh' });

    // 6. Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ 
      success: true, 
      msg: "Token refreshed successfully", 
      data: [] 
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ 
      success: false, 
      msg: "Session expired, please login again", 
      data: [] 
    });
  }
};

// ================== FORGOT PASSWORD ================== //
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
              success: false, 
              msg: 'User with that email does not exist.', 
              data: [] 
            });
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

        await sendEmail(email, 'Password Reset', emailContent);

        res.status(200).json({ 
          success: true, 
          msg: 'Password reset link sent to your email.', 
          data: [] 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          success: false, 
          msg: 'Error sending password reset email.', 
          data: [] 
        });
    }
};

// ================== RESET PASSWORD ================== //
exports.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;
    console.log("Raw Token from URL:", token);

    try {
        // Find the user with the token and check for expiry
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log("Hashed Token to search:", hashedToken);
        const user = await User.findOne({ 
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // $gt means 'greater than'
        });

        if (!user) {
            return res.status(400).json({ 
              success: false, 
              msg: 'Password reset token is invalid or has expired.', 
              data: [] 
            });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiry
        await user.save();

        res.status(200).json({ 
          success: true, 
          msg: 'Password has been successfully reset. Redirecting to login...', 
          data: [] 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          success: false, 
          msg: 'Error resetting password.', 
          data: [] 
        });
    }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, msg: "User nahi mila" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};
