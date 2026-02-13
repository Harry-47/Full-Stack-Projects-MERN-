const express = require("express");
const router = express.Router();

const { getEmployeeDashboard, processTaskAction, submitTask, getRequiredTasks, updateEmployeeProfile } = require("../../controllers/Employee/employeeController");
const { checkEmployee, checkToken } = require("../../middlewares/RBAC/accessControl");
const upload = require("../../configs/multerConfig");
const { createTaskSchema } = require("../../middlewares/validationSchemas/taskSchemas");
const { validateTask } = require("../../middlewares/validateTask");

router.get("/dashboard", checkToken, getEmployeeDashboard); //allowing manager too for viewing the stats but read-only
router.patch("/task/process/:taskId", checkToken, processTaskAction);
router.post("/task/submit/:taskId", checkToken, upload.array('attachments', 3), submitTask);
router.get("/tasks", checkToken, checkEmployee, getRequiredTasks);
router.patch('/update-profile', checkToken, upload.single('profilePic'), updateEmployeeProfile);

module.exports = router;
  