const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

//@desc add product to wishlist
//@route Post  /api/wishlist
//@access Private/Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Product added successfully to wishlist.',
        data: user.wishlist
    })
})

//@desc remove product from wishlist
//@route Delete  /api/wishlist
//@access Private/Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Product removed successfully from wishlist.',
        data: user.wishlist
    })
})

//@desc get logged user wishlist
//@route Get  /api/wishlist
//@access Private/Protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        status: 'success',
        results: user.wishlist.length,
        data: user.wishlist
    })
})