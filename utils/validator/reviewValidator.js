const { check } = require('express-validator');

const validationMiddleware = require('../../middlewares/validationMiddleware');
const ReviewModel = require('../../models/reviewModel');


exports.getReviewByIdValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format!'),
    validationMiddleware
]

exports.createReviewValidator = [
    check('title').optional(),
    check('ratings').notEmpty().withMessage('Rating must be required')
        .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('user').isMongoId().withMessage('Rating must be belong to User'),

    check('product').isMongoId().withMessage('Rating must be belong to Product')
        .custom((val, { req }) => (

            // Check if logged user create review before
            ReviewModel.findOne({ user: req.user._id, product: req.body.product }).then(
                (review) => {
                    //console.log(review);
                    if (review) {
                        return Promise.reject(
                            new Error('You already created a review before')
                        );
                    }
                }
            )
        ))
    ,
    validationMiddleware
]

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format!')
        .custom((val, { req }) =>
            ReviewModel.findById(val).then((review) => {
                if (!review) {
                    return Promise.reject(new Error(`There is no review for ${val}`))
                }
                if (review.user._id.toString() !== req.user._id.toString()) {
                    return Promise.reject(new Error(`You are not allowed to edit this review`))
                }
            })
        )
    ,

    validationMiddleware
]

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format!')
        .custom((val, { req }) => {
            if (req.user.role === 'user') {
                return ReviewModel.findById(val).then((review) => {
                    if (!review) {
                        return Promise.reject(new Error(`There is no review for ${val}`))
                    }
                    if (review.user._id.toString() !== req.user._id.toString()) {
                        return Promise.reject(new Error(`You are not allowed to delete this review`))
                    }
                })
            }
            return true;
        }),
    validationMiddleware
]