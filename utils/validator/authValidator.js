const { check, body } = require('express-validator');
const slugify = require('slugify');

const validationMiddleware = require('../../middlewares/validationMiddleware');
const UserModel = require('../../models/userModel');

exports.signUpValidator = [
    //check name to send name by body
    check('name').notEmpty().withMessage('Username is required!'),
    //check on name = slug
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Invalid email!')
        .custom(val =>
            UserModel.findOne({ email: val }).then(user => {
                if (user) return Promise.reject(new Error('Email already in use'))
            })
        ),
    check('password').notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .custom((val, { req }) => {
            if (val !== req.body.passwordConfirm) {
                throw new Error('Confirm password incorrect')
            }
            return true;
        }),
    check('passwordConfirm').notEmpty().withMessage('Confirm password required'),

    validationMiddleware
]


exports.loginValidator = [
    check('email').notEmpty().withMessage('Email is required!')
        .isEmail().withMessage('Invalid email!'),
    check('password').notEmpty().withMessage('Password is required!')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validationMiddleware
]
