const Task = require("../../models/taskSchema");
const { User } = require("../../models/userSchema");
const { sendTaskNotification } = require("../../configs/nodemailerConfig");


  exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeTasks,
      taskDistributionRaw,
      topPerformers,
      pendingReviews,
      name
    ] = await Promise.all([
      User.countDocuments({ role: "employee" }),
      Task.countDocuments({ status: "ongoing" }),
      Task.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      User.find({ role: "employee" })
        .select("name performance profilePic")
        .sort({ "performance.score": -1 })
        .limit(5),
      Task.countDocuments({
        status: "completed",
      }),
      User.find({role: "manager"}).select("name") // Sirf is manager ka naam
    ]);

    // Data Transformation for Charts
    const statusColors = {
      completed: "#4ade80",
      ongoing: "#22d3ee",
      failed: "#f87171",
      pending: "#fbbf24",
      accepted: "#a78bfa",
    };

    const taskDistribution = taskDistributionRaw.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      color: statusColors[item._id] || "#cccccc",
    }));

    const performance = topPerformers.map((emp) => ({
      name: emp.name?.split(" ")[0],
      score: emp.performance?.score || 0,
      pic: emp.profilePic?.url,
    }));



    res.status(200).json({
      success: true,
      data: {
        name: name[0].name,
        stats: { totalEmployees, activeTasks, pendingReviews },
        performance,
        taskDistribution,
      },
      msg: "Dashboard stats loaded successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error loading dashboard" });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { search, category } = req.query;

    // Search Query Builder
    const query = { role: "employee" }; 

    
    if (category) {
      query.category = category;
    }

   
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await User.find(query)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: employees, 
      msg: "Filtered employees fetched successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", data: {} });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found", data:{} });
    }

    // Manager can't delete other managers (Safety check)
    if (user.role === "manager") {
      return res.status(403).json({ success: false, msg: "Cannot delete a Manager!", data:{} });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, msg: "Employee removed successfully", data:{} });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error", data:{} });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { title, description, date, category, assignedTo } = req.body;
    const managerId = req.user.id; 

    // Manager ka naam nikaalo email bhejnay k liye
    const manager = await User.findById(managerId).select("name");

    const assets = req.files?.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      mimetype: file.mimetype
    })) || [];

    // 1. Employee dhoondo aur totalTasks increment karo ($inc use karna hai)
    const employee = await User.findOneAndUpdate(
      { _id: assignedTo, role: "employee" },
      { $inc: { "performance.totalTasks": 1 } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, msg: "Target Employee not found!" });
    }

    // 2. Create and Save Task
    const newTask = new Task({
      title,
      description,
      date, 
      category,
      assignedTo,
      createdBy: managerId,
      status: "pending",
      assets,
    });

    await newTask.save();

    // 3. Email Notification (Nodemailer config se function call)
    // Passing: Employee Email, Name, Task Title, Manager Name
    sendTaskNotification(employee.email, employee.name, title, manager.name);

    res.status(201).json({
      success: true,
      msg: "✅ Mission Deployed & Notification Sent!",
      data: newTask
    });

  } catch (error) {
    console.error("Task Assignment Error:", error);
    res.status(500).json({ success: false, msg: "Server Error: Could not assign mission" });
  }
};

exports.getManagerTasks = async (req, res) => {
  try {
    const { status } = req.query; 
    const managerId = req.user.id;

    let query = { createdBy: managerId, active: true };

    if(status === 'all')
      query.status = { $in: ['completed', 'accepted','failed']}
    else query.status = status

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email profilePic")
      .sort({ updatedAt: -1 }); // Newest history first

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Tasks fetch error" });
  }
};

exports.reviewTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, failedReason } = req.body; // status: 'accepted' or 'failed'


    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.id },
      { 
        status, 
        failedReason: status === 'failed' ? failedReason : null 
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, msg: "Task nahi mila" });


    const employee = await User.findById(task.assignedTo);
    if (!employee) return res.status(404).json({ success: false, msg: "Employee nahi mila" });

  
    let currentScore = employee.performance?.score || 0;
    let completed = employee.performance?.completedTasks || 0;
    let failed = employee.performance?.failedTasks || 0;

    if (status === 'accepted') {
      completed += 1;
      currentScore += 10; 
    } else if (status === 'failed') {
      failed += 1;
      currentScore = Math.max(0, currentScore - 5); 
    }
    
    employee.performance.completedTasks = completed;
    employee.performance.failedTasks = failed;
    employee.performance.score = currentScore;

    await employee.save();

    res.status(200).json({
      success: true,
      msg: `Task marked as ${status}. Employee score is now ${currentScore}`,
      data: { task, newScore: currentScore }
    });

  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ success: false, msg: "Review update failed" });
  }
};

exports.updateManagerProfile = async (req, res) => {
  try {
    const { name, number, bio } = req.body;
    let updateData = { name, number, bio };

    if (req.file) {
      updateData.profilePic = `uploads/${req.file.filename}`;
    }
    console.log(updateData)

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true }).select("-password");
    res.status(200).json({ success: true, msg: "Manager Profile Updated! 👑", data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};