const router = require('express').Router({ mergeParams: true });


const { createSubCategory, getSubCategories, getSubCategoryById, updateSubCategory,
    deleteSubCategory, setCategoryIdToBody, createFilterObj }
    = require('../services/subCategoryService');
const { createSubCategoryValidator, getSubCategoryByIdValidator, updateSubCategoryValidator, deleteSubCategoryValidator }
    = require('../utils/validator/subCategoryValidator');
const authServive = require('../services/authService');




router.route('/')
    .get(createFilterObj, getSubCategories)
    .post(authServive.protect, authServive.allowedTo('admin', 'manager'),
        setCategoryIdToBody, createSubCategoryValidator, createSubCategory);
router.route('/:id').get(getSubCategoryByIdValidator, getSubCategoryById)
    .put(authServive.protect, authServive.allowedTo('admin', 'manager'),
        updateSubCategoryValidator, updateSubCategory)
    .delete(authServive.protect, authServive.allowedTo('admin'),
        deleteSubCategoryValidator, deleteSubCategory)

module.exports = router;  