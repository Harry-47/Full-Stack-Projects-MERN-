const Task = require("../../models/taskSchema");
const { User } = require("../../models/userSchema");
const mongoose = require('mongoose');

exports.getEmployeeDashboard = async (req, res) => {
  try {
    const employeeId = req.query.employee ? req.query.employee  : req.user.id //so that admin passes id in params to get stats otherwise employee will have its id in jwt token
    console.log(employeeId)

    // 1. Parallel counts for personal stats
    const [ongoingTasks, taskDistributionRaw, user] = await Promise.all([
      Task.countDocuments({
        assignedTo: employeeId,
        status: "ongoing",
        active: true,
      }),
      Task.aggregate([
        { 
          $match: { 
            assignedTo: new mongoose.Types.ObjectId(employeeId), 
            active: true 
          } 
        },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      User.findById(employeeId).select("name performance"),
    ]);

    // 2. Format Pie Chart Data
    const statusColors = {
      pending: "#fbbf24",
      ongoing: "#22d3ee",
      completed: "#4ade80",
      accepted: "#8b5cf6",
      failed: "#f87171",
    };

    const taskDistribution = taskDistributionRaw.map((item) => ({
      name: item._id.toUpperCase(),
      value: item.count,
      color: statusColors[item._id] || "#cbd5e1",
    }));



    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        score: user.performance?.score || 0,
        stats: { ongoingTasks },
        taskDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Dashboard error" });
  }
};

// 1. Mission Acception or rejection (Status: pending -> ongoing)
exports.processTaskAction = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { action, failedReason } = req.body; // action: 'accept' or 'reject'
    const employeeId = req.user.id;

    // Logic: Accept -> ongoing, Reject -> failed
    const newStatus = action === "accept" ? "ongoing" : "failed";

    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedTo: employeeId, status: "pending" },
      { 
        status: newStatus,
        failedReason: action === "reject" ? failedReason : null 
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, msg: "Mission not found or already processed" });

    res.status(200).json({
      success: true,
      msg: action === "accept" ? "Target Locked! Mission started. 🫡" : "Mission Rejected. Notification sent to Manager.",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Action failed" });
  }
};

// 2. Mission Submission (With Proof/Assets)
exports.submitTask = async (req, res) => {
  try {
    const { message } = req.body;

    // Files ko format karna
    const attachments =
      req.files?.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      })) || [];

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, assignedTo: req.user.id, status: "ongoing" },
      {
        status: "completed", // Manager k review k liye 'completed' set kar rahay hain
        submission: {
          message,
          submittedAt: Date.now(),
          attachments,
        },
      },
      { new: true },
    );

    if (!task)
      return res
        .status(404)
        .json({
          success: false,
          msg: "Task not found or not in ongoing state",
        });

    res
      .status(200)
      .json({ success: true, msg: "Report submitted to Command Center! 🚀" });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Submission failed" });
  }
};

exports.getRequiredTasks = async (req, res) => {
  try {
    const { status } = req.query; 
    const employeeId = req.user.id;
    console.log(employeeId)

    if (!status) {
      return res.status(400).json({
        success: false, 
        msg: "No status provided!", 
        data: [] 
      });
    }

    let query = { assignedTo: employeeId };

    if (status === 'all') {
      query.status = { $in: ['completed', 'accepted', 'failed'] };
    } else {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      msg: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (err) {
    console.error("Fetch Error:", err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      data: [],
    });
  }
};


exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { name, number, bio } = req.body; // Yahan tu 'skills' ya 'category' bhi le sakta hai
    let updateData = { name, number, bio };

    if (req.file) {
      updateData.profilePic = `uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true }).select("-password");
    res.status(200).json({ success: true, msg: "Employee Profile Updated! 🫡", data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};