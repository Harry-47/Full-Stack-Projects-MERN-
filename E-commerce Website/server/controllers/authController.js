const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const crypto = require('crypto');
const {User} = require("../models/userSchema");
const { sendEmail } = require("../configs/nodemailerConfig");
const path = require("path");




// ================== HELPER: TOKEN CREATOR ================== //

createTokens = (user, printHash) => {
  const accessToken =  jwt.sign(
    {
      id: user._id,
      role: user.role,
      printHash: printHash
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1min",
    }
  )

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,

    { expiresIn: "7d",
    }
  )
  return {accessToken, refreshToken}
};

// ================== MIDDLEWARE: CHECK TOKEN ================== //
exports.checkToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const fingerprint = req.cookies.fingerprint;

  if (!accessToken)
    return res.status(401).json({ error: "Unauthorized - token missing" });

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const hashMatch = crypto.createHash('sha256').update(fingerprint).digest('hex') === decoded.printHash

    if(!hashMatch)
      return res.status(401).json({msg: 'Unauthorized'})

    req.user = decoded; // attaches cookie to req.user
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};


exports.checkAdmin = (req, res, next) => {
  // `checkToken` should have already attached req.user
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    // User is not an admin or token is invalid
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};
exports.checkUser = (req, res, next) => {
    // checkToken should have already attached req.user
    if (req.user && req.user.role === 'user') {
        next(); // User is a regular user, proceed
    } else {
        // Not a regular user, deny access
        res.status(403).json({ error: 'Forbidden: User access required' });
    }
};

exports.registerUser = async (req, res) => {

  const { name, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (role === 'admin' && existingAdmin) {
      return res.status(400).json({ error: "You can not become admin. Multiple Attempts will result in a lifelong ban!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      verified: false,
    });

    await newUser.save();

    res.status(201).json({
      message: "User saved successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: `${error}` });
  }
};



// ================== LOGIN ================== //

exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(405).json({ error: "No User Found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

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
        res.status(200).json({ message: "🚪 Logged out successfully", isLoggedOut});
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
    }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken, fingerprint } = req.cookies; 

  if (!refreshToken || !fingerprint) {
    return res.status(401).json({ error: "Unauthorized - missing data" });
  }

  try {
    // 1. Token verify karo
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 2. DB mein user dhoondo aur check karo ke token wahi hai?
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Forbidden - Token revoked or invalid" });
    }

    // 3. Naya fingerprint hash banao
    const printHash = crypto.createHash('sha256').update(fingerprint).digest('hex');

    // 4. Naye tokens banao (PASS THE USER OBJECT FROM DB)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = createTokens(user, printHash);

    // 5. Cookies set karo
    res.cookie("accessToken", newAccessToken, { httpOnly: true, path: '/' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, path: '/api/v1/auth/refresh' });

    // 6. DB update karo
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ error: "Session expired, please login again" });
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

        await sendEmail(email, 'Password Reset', emailContent);

        res.status(200).json({ message: 'Password reset link sent to your email.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending password reset email.' });
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
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiry
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

module.exports.createTokens = createTokens;

