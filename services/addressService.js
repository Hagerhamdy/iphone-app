const asyncHandler = require('express-async-handler');
const UserModel = require('../models/userModel');

//@desc add address to addresses list
//@route Post  /api/address
//@access Private/addressId/User
exports.addAddressToUseraddresses = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Address added successfully to addresses list.',
        data: user.addresses
    })
})

//@desc remove address from addresses
//@route Delete  /api/address
//@access Private/addressId/User
exports.removeAddressFromAddresses = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    }, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'Address removed successfully from addresses.',
        data: user.addresses
    })
})

//@desc get logged user addresses
//@route Get  /api/address
//@access Private/addressId/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).populate('addresses');
    res.status(200).json({
        status: 'success',
        results: user.addresses.length,
        data: user.addresses
    })
})