const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const factory = require('./handlerFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const BrandModel = require('../models/brandModel');


//upload single image
exports.uploadBrandImage = uploadSingleImage('image');

//image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    //console.log(req.file);
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/brand/${filename}`);
        //save image into db
    req.body.image = filename;
    next();
})

//@desc Get all Brand
//@route Get /api/Brand
//@accsee Public
exports.getBrands = factory.getAll(BrandModel);

//@desc Get Brand by id
//@route Get /api/Brand/:id
//@access Private/admin-manager
exports.getBrandById = factory.getOne(BrandModel);

//@desc Create Brand
//@route Post /api/Brand
//@accsee Private/admin-manager
exports.createBrand = factory.createOne(BrandModel);

//@desc Put Brand by id
//@route Put /api/Brand/:id
//@access Private/admin-manager
exports.updateBrand = factory.updateOne(BrandModel);


//@desc Delete Brand by id
//@route Delete /api/Brand/:id
//@access Private/admin
exports.deleteBrand = factory.deleteOne(BrandModel);
