const router = require('express').Router();

const { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updateCartItemQuantity, applyCoupon } =
    require('../services/cartService');
// const { getBrandByIdValidator, createBrandValidator, updateBrandValidator, deleteBrandValidator } =
//     require('../utils/validator/brandValidator');
const authServive = require('../services/authService');

router.use(authServive.protect, authServive.allowedTo('user'));

router.route('/')
    .get(getLoggedUserCart)
    .post(addProductToCart)
    .delete(clearCart);

router.put('/applyCoupon', applyCoupon);

router.route('/:itemId').get()
    .put(updateCartItemQuantity)
    .delete(removeSpecificCartItem);


module.exports = router;  