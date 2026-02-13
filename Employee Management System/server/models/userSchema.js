const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
{
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ["employee", "manager"],
    default: "employee"
  },
  category : {
    type: String,
    enum: ['Development', 'Design', 'Marketing', 'HR', 'Testing'],
  },

  googleId: String,
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
  totalTasks: {
    type: Number,
    default: 0
  }
,
  performance: {
    tasksCompleted: { type: Number, default: 0 },
    tasksFailed: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  number: {
    type: String,
    default: null,
    length: 11
  },
  bio:{
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
}, {timestamps: true })
exports.User = mongoose.model('User', userSchema);
