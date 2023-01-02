const { check } = require('express-validator');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const UserModel = require('../../models/userModel');


exports.addProductToWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid User id format!')
        //check if productId exists in db
        .custom((val, { req }) => UserModel.findOne({ wishlist: req.body.productId }).then(product => {
            if (!product) {
                return Promise.reject(new Error(`There no ids in products ids matches with ${val}`));
            }
        })
        ),
    validationMiddleware
]

exports.removeProductFromWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid User id format!')
        .custom((val) =>
            UserModel.findOne({ wishlist: val }).then(user => {
                if (!user) return Promise.reject(new Error('This ProductId not found'))
            })
        )
    ,
    validationMiddleware
]