const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
{
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  googleId: String,
  linkedinId: String,
  githubId: String,

  displayName: String,
    
  resetPasswordToken: {
        type: String
  },

  resetPasswordExpires: {
        type: Date
  },
  profilePic: {
    type: String,
    default: null
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  refreshToken:{
    type: String,
    default: null
  }
})
exports.User = mongoose.model('User', userSchema);
