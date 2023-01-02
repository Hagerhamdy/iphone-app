const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');


const CategoryModel = require('../models/categoryModel');
const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

//upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    //console.log(req.file);
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/category/${filename}`);
        //save image into db
        req.body.image = filename;
    }
    next();
})

//@desc Get all category
//@route Get /api/category
//@accsee Public
exports.getCategories = factory.getAll(CategoryModel);

//@desc Get category by id
//@route Get /api/category/:id
//@access Private/admin-manager
exports.getCategoryById = factory.getOne(CategoryModel);


//@desc Create category
//@route Post /api/category
//@accsee Private/admin-manager
exports.createCategory = factory.createOne(CategoryModel);

//@desc Put category by id
//@route Put /api/category/:id
//@access Private/admin-manager
exports.updateCategory = factory.updateOne(CategoryModel);


//@desc Delete category by id
//@route Delete /api/category/:id
//@access Private/admin
exports.deleteCategory = factory.deleteOne(CategoryModel);