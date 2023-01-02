const { check, body } = require('express-validator');
const slugify = require('slugify');

const validationMiddleware = require('../../middlewares/validationMiddleware');
const CategoryModel = require('../../models/categoryModel');
const SubCategoryModel = require('../../models/subCategoryModel');
const ProductModel = require('../../models/productModel');


exports.getProductByIdValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format!'),
    validationMiddleware
]

exports.createProductValidator = [
    //check name to send name by body
    check('title').notEmpty().withMessage('Title Product is required!')
        .custom((value) => (
            ProductModel.findOne({ title: { $eq: value } }).then((product) => {
                if (product === value) {
                    throw new Error('Title already exists');
                }
                return true;
            })
        )),
        //check on title = slug
    body('title').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('description').notEmpty().withMessage('description Product is required!'),
    check('quantity').notEmpty().withMessage('quantity Product is required!')
        .isNumeric().withMessage('quantity Product must be number'),
    check('sold').optional().isNumeric().withMessage('Sold Product must be number'),
    check('price').notEmpty().withMessage('price Product is required!')
        .isNumeric().withMessage('Price Product must be number'),
    check('priceAfterDiscount').optional().isNumeric().withMessage('priceAfterDiscount Product must be number')
        .toFloat().custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('priceAfterDiscount must be lower than price');
            }
            return true;
        }),
    check('colours').optional().isArray().withMessage('colours must be an array of string'),
    check('images').optional().isArray().withMessage('images must be an array of string'),
    check('imageCover').notEmpty().withMessage('imageCover Product is required!'),
    check('category').notEmpty().withMessage('Product must be belong to a category')
        .isMongoId().withMessage('Invalid category id format!')
        //validate if category already exists or not 
        .custom((categoryId) => (
            CategoryModel.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(new Error(`There is no category with id ${categoryId}`))
                }
            })
        )),
    check('subCategory').optional().isMongoId().withMessage('Invalid subCategory id format!')
        //validate subCategory ids in db equals subCategory ids from body
        .custom((subcategoriesIds) => (
            SubCategoryModel.find({ _id: { $exists: true, $in: subcategoriesIds } }).then((subcategories) => {
                //  console.log(subcategories)
                if (subcategories.length < 1 || subcategories.length !== subcategoriesIds.length) {
                    return Promise.reject(new Error(`There no ids in subcategories ids matches with ${subcategoriesIds}`));
                }
            })
        ))
        //validate check subCategory ids that belong to category
        .custom((subcategoriesIds, { req }) =>
            //get all subcategories in this category
            SubCategoryModel.find({ category: req.body.category }).then((subCategories) => {
                // console.log(category);
                const subCategoriesInDB = [];
                //push all subcategories ids in one array 
                subCategories.forEach(subCategory => {
                    subCategoriesInDB.push(subCategory._id.toString());
                })
                // console.log(subCategoriesInDB)
                //check if subcategories ids exist in category or not
                const checker = subcategoriesIds.every(val => subCategoriesInDB.includes(val));
                //console.log(checker);
                if (!checker)
                    return Promise.reject(new Error(`SubCategories not belong to parent category`));
            })
        )
    ,
    check('brand').optional().isMongoId().withMessage('Invalid brand id format!'),
    check('ratingAverage').optional().isNumeric().withMessage('ratingAverage Product must be number')
        .isLength({ min: 1 }).withMessage('ratingAverage must be above or equal 1')
        .isLength({ max: 5 }).withMessage('ratingAverage must be below or equal 5'),
    check('ratingsQuantity').optional().isNumeric().withMessage('ratingsQuantity Product must be number')

    , validationMiddleware
]

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format!'),
    body('title').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format!'),
    validationMiddleware
]