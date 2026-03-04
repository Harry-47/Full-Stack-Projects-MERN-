const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Jisko notification milega
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // Jisne action kiya
    type: { type: String, enum: ['like', 'comment', 'follow'], required: true },      // Kis type ki hai
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },                      // (Optional) Agar post se related hai
    read: { type: Boolean, default: false }                                           // Seen/Unseen
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);