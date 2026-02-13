const express = require('express');
const router = express.Router();
const { getAllOrders,
    updateOrderStatus,
    deleteOrderById,
    searchOrders
    } = require('../../controllers/admin/adminOrderController');


router.get('/', getAllOrders);
router.put('/update-status/:orderId', updateOrderStatus);
router.delete('/:orderId', deleteOrderById);
router.get('/search', searchOrders);

module.exports = router;
