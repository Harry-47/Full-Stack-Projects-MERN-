const express = require('express');
const router = express.Router();

const { getDashboardData } = require('../../controllers/Admin/admindashboardController');
// Route to get dashboard data
router.get('/',  getDashboardData);
module.exports = router;