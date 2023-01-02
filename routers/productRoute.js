const router = require('express').Router();

const { getproducts, createProduct, getProductById, updateProduct, deleteProduct, uploadProductImages, resizeProductImages } =
    require('../services/productService');
const { getProductByIdValidator, createProductValidator, updateProductValidator, deleteProductValidator } =
    require('../utils/validator/productValidator');
const authServive = require('../services/authService');

const reviewRoute = require('./reviewRoute');


//Nested route for using review in product
//Get /product/productId/review
//Post /product/productId/review
//Get /product/productId/review/reviewId
router.use('/:productId/review', reviewRoute);

router.route('/').get(getproducts)
    .post(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadProductImages, resizeProductImages, createProductValidator, createProduct);
router.route('/:id').get(getProductByIdValidator, getProductById)
    .put(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadProductImages, resizeProductImages, updateProductValidator, updateProduct)
    .delete(authServive.protect, authServive.allowedTo('admin'),
        deleteProductValidator, deleteProduct);


module.exports = router;  