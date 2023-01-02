const factory = require('./handlerFactory');
const CouponModel = require('../models/couponModel');


//@desc Get all Coupons
//@route Get /api/Coupon
//@accsee Private/admin - manager
exports.getCoupons = factory.getAll(CouponModel);

//@desc Get Coupon by id
//@route Get /api/Coupon/:id
//@access Private/admin-manager
exports.getCouponById = factory.getOne(CouponModel);

//@desc Create Coupon
//@route Post /api/Coupon
//@accsee Private/admin-manager
exports.createCoupon = factory.createOne(CouponModel);

//@desc Put Coupon by id
//@route Put /api/Coupon/:id
//@access Private/admin-manager
exports.updateCoupon = factory.updateOne(CouponModel);


//@desc Delete Coupon by id
//@route Delete /api/Coupon/:id
//@access Private/admin- manager
exports.deleteCoupon = factory.deleteOne(CouponModel);
