const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUserAndOrdersAndCart, 
        searchUsersByName
     } = require('../../controllers/Admin/adminUserController');

router.get('/', getAllUsers);
router.get('/search', searchUsersByName);
router.delete('/delete', deleteUserAndOrdersAndCart);

module.exports = router;
