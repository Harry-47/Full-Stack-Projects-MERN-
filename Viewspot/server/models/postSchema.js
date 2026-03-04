const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: "" },
    mediaUrl: { type: String, required: true }, // File path on server
    mediaType: { 
        type: String, 
        enum: ["image", "video"], 
        required: true 
    }, 

    // Links
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);