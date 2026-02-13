const express = require('express');
const router = express.Router();
const { placeOrder, getOrdersByUser, cancelOrder, deleteAllOrders, verifyOrder } = require('../../controllers/User/orderController');
const { placementSchema } = require("../../Utils/validationSchemas/orderSchemas")
const { validateOrder} = require("../../middlewares/validateOrder")

router.post('/place', validateOrder(placementSchema),placeOrder);
router.get('/', getOrdersByUser);
router.put('/cancel-order/:orderId', cancelOrder);
router.delete('/delete-all', deleteAllOrders); 
router.get('/verify/:orderId', verifyOrder);

module.exports = router;