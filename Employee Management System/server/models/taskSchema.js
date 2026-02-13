const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true }, // Deadline
  
  category: { 
    type: String, 
    enum: ['Development', 'Design', 'Marketing', 'Testing', 'HR'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'failed'],
    default: 'pending'
  },
  
  assets: [
    {
      filename: String,     // e.g. "17482394-design.pdf" (Unique server name)
      originalName: String, // e.g. "UI_Brief.pdf" (to show to user)
      path: String,         // e.g. "uploads/tasks/17482394-design.pdf"
      mimetype: String      // e.g. "application/pdf" (for showing icon)
    }
  ],
  
  // 5. Relations
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Manager ki ID
    required: true
  },

  submission: {
    message: { type: String },
    submittedAt: { type: Date },
    attachments: [
      {
        filename: String,
        originalName: String,
        path: String,
        mimetype: String
      }
    ]
  },

  active: { type: Boolean, default: true }, //for soft delete
  failedReason: { type: String, default: null } 

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);