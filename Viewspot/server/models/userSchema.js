const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
{
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,

  googleId: String,

  displayName: String,
    
  resetPasswordToken: {
        type: String
  },

  resetPasswordExpires: {
        type: Date
  },
  
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePic: { 
    type: String, 
    default: "" 
  }, // Uploads folder ka path ya Google Image URL ayega idhr
  
  bio: { 
    type: String, 
    default: "" 
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],

  likedReels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ], // Page 6: Liked videos
  
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]

}, { timestamps: true})
exports.User = mongoose.model('User', userSchema);
