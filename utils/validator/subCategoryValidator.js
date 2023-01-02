const { check, body } = require('express-validator');
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');


exports.getSubCategoryByIdValidator = [
    check('id').not().isEmpty().withMessage('SubCategory id must be required')
        .isMongoId().withMessage('Invalid category id format!'),
    validationMiddleware
]

exports.createSubCategoryValidator = [
    //check name to send name by body
    check('name').not().isEmpty().withMessage('Name category is required!'),
    //check on title = slug
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('SubCategory must be belong to category')
        .isMongoId().withMessage('Invalid category id format!'),
    validationMiddleware
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format!'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format!'),
    validationMiddleware
]