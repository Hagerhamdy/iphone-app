const { check, body } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const validationMiddleware = require('../../middlewares/validationMiddleware');
const UserModel = require('../../models/userModel');


exports.getUserByIdValidator = [
    check('id').isMongoId().withMessage('Invalid User id format!'),
    validationMiddleware
]

exports.createUserValidator = [
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
    check('profileImg').optional(),
    check('phone').optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Please enter a phone number with Egy or SA'),
    check('role').optional(),
    check('wishlist').optional().isArray().withMessage('wishlist must be an array'),

    validationMiddleware
]

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format!'),
    body('name').optional().custom((val, { req }) => {
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
    check('profileImg').optional(),
    check('phone').optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Please enter a phone number with Egy or SA'),
    check('role').optional(),

    validationMiddleware
]

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('Invalid User id format!'),
    body('currentPassword').notEmpty().withMessage('Current Password required'),
    body('passwordConfirm').notEmpty().withMessage('Confirm Password required'),
    body('password').notEmpty().withMessage('password required')
        .custom(async (val, { req }) => {
            //verify currnt password
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                throw new Error(`There is no user with id ${req.params.id}`);
            }
            const isCuurentPassword = await bcrypt.compare(req.body.currentPassword, user.password);
            if (!isCuurentPassword) {
                throw new Error(`Incorrect Current Password`);
            }
            //verify confirm password
            if (val !== req.body.passwordConfirm) {
                throw new Error('Confirm password incorrect')
            }
            return true;
        })
    , validationMiddleware
]

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format!'),
    validationMiddleware
]

exports.updateLoggedUserValidator = [
    body('name').optional().custom((val, { req }) => {
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
    check('phone').optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Please enter a phone number with Egy or SA'),

    validationMiddleware
]