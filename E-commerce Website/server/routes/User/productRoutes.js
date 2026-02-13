const express = require('express');
const router = express.Router();
const { getProductsByCategory,
        getAllProducts,
        getProductById,
        getSearchProducts,
        addReviews,
      } = require('../../controllers/User/productController');
const { checkToken , checkUser } = require('../../controllers/authController')
const { validateProduct} =  require("../../middlewares/validateProduct")
const { reviewSchema } = require("../../Utils/validationSchemas/productSchemas")


router.get('/', getAllProducts);
router.get('/search', getSearchProducts);
router.get('/categories/:category', getProductsByCategory)
router.get('/:productId', getProductById);
router.post('/add-review',checkToken, checkUser, validateProduct(reviewSchema), addReviews);




module.exports = router;
