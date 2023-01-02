const router = require('express').Router();

const { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory, uploadCategoryImage, resizeImage } =
    require('../services/categoryService');
const { getCategoryByIdValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } =
    require('../utils/validator/categoryValidator');

const authServive = require('../services/authService');

const subCategoryRoute = require('./subCategoryRoute');


//merge subcategory router with category router
router.use('/:categoryId/subcategory', subCategoryRoute);

router.route('/').get(getCategories)
    .post(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);
router.route('/:id').get(getCategoryByIdValidator, getCategoryById)
    .put(authServive.protect, authServive.allowedTo('admin', 'manager'),
        uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
    .delete(authServive.protect, authServive.allowedTo('admin'),
        deleteCategoryValidator, deleteCategory);


module.exports = router;  