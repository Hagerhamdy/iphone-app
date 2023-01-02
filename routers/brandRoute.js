const router = require('express').Router();

const { getBrands, createBrand, getBrandById, updateBrand, deleteBrand, uploadBrandImage, resizeImage } =
    require('../services/brandService');
const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } =
    require('../utils/validator/brandValidator');
const authServive = require('../services/authService');



router.route('/').get(getBrands)
    .post(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadBrandImage, resizeImage, createBrandValidator, createBrand);
        
router.route('/:id').get(getBrandByIdValidator, getBrandById)
    .put(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
    .delete(authServive.protect, authServive.allowedTo('admin'),
        deleteBrandValidator, deleteBrand);


module.exports = router;  