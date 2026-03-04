const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    sharedPost: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null, // Agar simple text message hai to null rahega
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);