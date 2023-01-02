const { check, body } = require('express-validator');
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');


exports.getCategoryByIdValidator = [
    check('id').isMongoId().withMessage('Invalid category id format!'),
    validationMiddleware
]

exports.createCategoryValidator = [
    //check name to send name by body
    check('name').notEmpty().withMessage('Name category is required!'),
    //check on title = slug
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format!'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format!'),
    validationMiddleware
]