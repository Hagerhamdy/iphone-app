const router = require('express').Router();

const authService = require('../services/authService');
const { addProductToWishlist, removeProductFromWishlist, getLoggedUserWishlist } = require('../services/wislistService');
const { addProductToWishlistValidator, removeProductFromWishlistValidator } = require('../utils/validator/wishlistValidator');

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addProductToWishlistValidator, addProductToWishlist)
    .get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlistValidator, removeProductFromWishlist)

module.exports = router;