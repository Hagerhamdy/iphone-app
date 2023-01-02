const router = require('express').Router();

const { getCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon } =
    require('../services/couponService');

const authServive = require('../services/authService');


router.use(authServive.protect, authServive.allowedTo('admin', 'manager'));

router.route('/').get(getCoupons)
    .post(createCoupon);

router.route('/:id').get(getCouponById)
    .put(updateCoupon)
    .delete(deleteCoupon);


module.exports = router;  