const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');

const ProductModel = require('../models/productModel');

const factory = require('./handlerFactory');
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");


exports.uploadProductImages = uploadMixOfImages([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    //console.log(req.files);
    //1-image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/product/${imageCoverFileName}`);
        //save imageCover into db
        req.body.imageCover = imageCoverFileName;
    }
    //2-image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(req.files.images.map(async (img, index) => {
            const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
            await sharp(img.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 95 })
                .toFile(`uploads/product/${imageName}`);

            //save imageCover into db
            req.body.images.push(imageName);
            // console.log(req.body.images)
        })
        )
    }
    next();
});


//@desc Get all Product
//@route Get /api/Product
//@accsee Public
exports.getproducts = factory.getAll(ProductModel, 'Product');

//@desc Get Product by id
//@route Get /api/Product/:id
//@access Private/admin-manager
exports.getProductById = factory.getOne(ProductModel, 'reviews');

//@desc Create Product
//@route Post /api/Product
//@accsee Private/admin-manager
exports.createProduct = factory.createOne(ProductModel);

//@desc Put Product by id
//@route Put /api/Product/:id
//@access Private/admin-manager
exports.updateProduct = factory.updateOne();


//@desc Delete Product by id
//@route Delete /api/Product/:id
//@access Private/admin
exports.deleteProduct = factory.deleteOne(ProductModel);