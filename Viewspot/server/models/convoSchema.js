const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: [ // Users involved in the chat
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    lastMessage: { type: String, default: "" }, // For DM list preview
    
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);