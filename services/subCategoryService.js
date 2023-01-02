
const SubCategoryModel = require('../models/subCategoryModel');
const factory = require('./handlerFactory');



//apply nested route in create
exports.setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category)
        req.body.category = req.params.categoryId;
    next();
}

// Nested route
// GET /api/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

//@desc Get all subCategory
//@route Get /api/subCategory
//@accsee Public
exports.getSubCategories = factory.getAll(SubCategoryModel);

//@desc Get category by id
//@route Get /api/category/:id
//@access Private/admin-manager
exports.getSubCategoryById = factory.getOne(SubCategoryModel);

//@desc Create subCategory
//@route Post /api/subCategory
//@accsee Private/admin-manager
exports.createSubCategory = factory.createOne(SubCategoryModel);

//@desc Put subCategory by id
//@route Put /api/subCategory/:id
//@access Private/admin-manager
exports.updateSubCategory = factory.updateOne(SubCategoryModel);

//@desc Delete subCategory by id
//@route Delete /api/subCategory/:id
//@access Private/admin
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
