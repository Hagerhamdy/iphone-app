const { check, body } = require('express-validator');
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');


exports.getBrandByIdValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format!'),
    validationMiddleware
]

exports.createBrandValidator = [
    //check name to send name by body
    check('name').notEmpty().withMessage('Name Brand is required!'),
    //check on title = slug
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format!'),
    body('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format!'),
    validationMiddleware
]