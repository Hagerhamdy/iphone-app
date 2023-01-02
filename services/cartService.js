const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const cartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const CouponModel = require('../models/couponModel');

const calcTotalCartPrice = cart => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => {
        totalPrice += item.quantity * item.price
    })
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
}

//@desc Create Cart
//@route Post /api/cart
//@accsee Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;
    //get price from product
    const product = await ProductModel.findById(productId);
    //get cart for logged user
    let cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        //1- create cart for logged user with product
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{
                product: productId,
                color,
                price: product.price
            }]
        })
    } else {
        // console.log('Cart already exist')
        //if product exist, update quantity
        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === productId
            && item.color === color);
        // console.log(productIndex)
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price
            })
        }
    }
    //calc total cart price
    calcTotalCartPrice(cart)
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart
    })
})

//@desc get CartItems
//@route Get /api/cart
//@accsee Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(`There is no cart with id ${req.user._id}`));
    }
    res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
})

//@desc remove CartItem
//@route Delete /api/cart/:itemId
//@accsee Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.itemId } }
    }, { new: true })

    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
})

//@desc clear CartItems
//@route Delete /api/cart
//@accsee Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
    await cartModel.findOneAndDelete({ user: req.user._id });
    res.status(200).json('CartItems deleted');
})

//@desc update CartItem quantity
//@route Put /api/cart/:itemId
//@accsee Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) {
        return next(new ApiError(`There is no cart with id ${req.user._id}`, 404));
    }
    const itemIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.itemId)
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(new ApiError(`There is no item with id ${req.params.itemId}`, 404));
    }
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
})

//@desc apply Coupon  on Cart
//@route Put /api/cart/applyCoupon
//@accsee Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    //1- Get coupon based on coupon name
    const coupon = await CouponModel.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() }
    })
    if (!coupon) {
        return next(new Error(`Invalid coupon name or expire`));
    }
    //2- Get logged user cart to get total cart price
    const cart = await cartModel.findOne({ user: req.user._id });
    const totalPrice = cart.totalCartPrice;
    //3- Calc price after discount
    const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();
    res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
})