// routes/User/cartRoutes.js

const express = require('express');
const router = express.Router();


const { getCartItems, addToCart, updateCartQuantity, removeFromCart } = require('../../controllers/User/cartController');

const { checkToken , checkUser } = require('../../controllers/authController')
const { flexibleCartSchema} = require("../../Utils/validationSchemas/cartSchemas")
const { validateCart} = require("../../middlewares/validateCart")


router.get('/', checkToken, checkUser, getCartItems);
router.post('/new', checkToken, checkUser, validateCart(flexibleCartSchema), addToCart);
router.put('/remove/:productId', checkToken, checkUser, removeFromCart); 
router.post('/update', checkToken, checkUser, validateCart(flexibleCartSchema), updateCartQuantity);

module.exports = router;