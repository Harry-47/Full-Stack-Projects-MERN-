const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllEmployees, deleteUser, assignTask, getManagerTasks, reviewTask, updateManagerProfile } = require("../../controllers/Manager/managerController");
const { checkManager, checkToken } = require("../../middlewares/RBAC/accessControl");
const upload = require("../../configs/multerConfig");
const { createTaskSchema } = require("../../middlewares/validationSchemas/taskSchemas");
const { validateTask } = require("../../middlewares/validateTask");

router.get("/dashboard", checkToken, checkManager,  getDashboardStats);
router.get("/employees", checkToken, checkManager, getAllEmployees); // ?search=ali
router.delete("/employee/:id", checkToken, checkManager, deleteUser);
router.post("/assign-task", checkToken, checkManager, upload.array('assets', 5), validateTask(createTaskSchema), assignTask);
router.get("/tasks", checkToken, checkManager, getManagerTasks);
router.patch("/task/review/:taskId", checkToken, checkManager, reviewTask);
router.patch('/update-profile', checkToken, upload.single('profilePic'), updateManagerProfile);



module.exports = router;