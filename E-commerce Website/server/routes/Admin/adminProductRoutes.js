const express = require('express');
const router = express.Router();
const {
      getAllProducts, 
      addProduct,
      deleteProduct,  
      getByCategory, 
      getProductById,
      editProduct, 
      getSearchProducts
      } = require('../../controllers/Admin/adminProductController');
const upload = require('../../configs/multerConfig');
const { productSchema , editProductSchema} = require('../../Utils/validationSchemas/productSchemas');
const { validateAddition } = require("../../middlewares/validateProduct")

router.get('/', getAllProducts);
router.get('/search', getSearchProducts);
router.get('/categories/:type',  getByCategory);

router.post('/new', upload.single('image'), validateAddition(productSchema), addProduct);
router.get('/edit/:id', getProductById);
router.put('/edit/:id',  upload.single('image'), validateAddition(editProductSchema),  editProduct);

router.delete('/delete/:id', deleteProduct);

module.exports = router;
