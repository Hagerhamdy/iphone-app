const asyncHandler = require('express-async-handler');
const Stripe = require('stripe')(process.env.STRIPE_SECRET);

const ApiError = require('../utils/ApiError');
const factory = require('./handlerFactory');

const CartModel = require('../models/cartModel');
const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');
const UserModel = require('../models/userModel');


//@desc Create cash order
//@route Post /api/order/cartId
//@accsee Private/Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    //1- Get cart depend on cartId
    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`There is no cart with cartId : ${req.params.cartId}`));
    }
    //2-Get order price depend on cart price "check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalCartPrice
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    //3- Create order with default paymentMethodType cash
    const order = await OrderModel.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice
    });
    //4- After creating order, decrement 'Product Quantity' , increment 'Product Sold'
    if (order) {
        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }))
        await ProductModel.bulkWrite(bulkOptions, {});
        //5- Clear cart depend on cartId  
        await CartModel.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({ status: 'success', data: order })
})

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'user') {
        req.filterObj = { user: req.user._id };
    }
    next()
})

//@desc Get all orders
//@route Get /api/order
//@accsee Private/Protected/admin-manager-user
exports.getAllOrder = factory.getAll(OrderModel);

//@desc Get order by id
//@route Get /api/order/:id
//@accsee Private/Protected/admin-manager-user
exports.getOrderById = factory.getOne(OrderModel);

//@desc update order Paid to paid
//@route Put /api/order/:id/pay
//@accsee Private/Protected/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There is no order with id : ${req.params.id}`, 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: 'success', data: updatedOrder });
})

//@desc update order Deliver to delivered
//@route Put /api/order/:id/deliver
//@accsee Private/Protected/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        return next(new ApiError(`There is no order with id : ${req.params.id}`, 404));
    }
    order.isDelevered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: 'success', data: updatedOrder });
})

//@desc Get checkout session from stripe and send it to response
//@route Put /api/order/checkout-session/:cartId
//@accsee Private/Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
    const taxPrice = 0;
    const shippingPrice = 0;
    //1- Get cart depend on cartId
    const cart = await CartModel.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`There is no cart with cartId : ${req.params.cartId}`));
    }
    //2-Get order price depend on cart price "check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount ?
        cart.totalPriceAfterDiscount : cart.totalCartPrice
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    //3- Create stripe checkout session
    const session = await Stripe.checkout.sessions.create({
        line_items: [
            {
                name: req.user.name,
                amount: totalOrderPrice * 100,
                currency: 'egp',
                quantity: 1
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress
    })
    res.status(200).json({ status: 'success', session });
})

const createCartOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const cart = await CartModel.findById(cartId);
    const user = await UserModel.findOne({ email: session.customer_email })

    //3- Create order with default paymentMethodType cash
    const order = await OrderModel.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress: shippingAddress,
        isPaid: true,
        paidAt: Date.now(),
        totalOrderPrice: orderPrice
    });

    //4- After creating order, decrement 'Product Quantity' , increment 'Product Sold'
    if (order) {
        const bulkOptions = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            }
        }))
        await ProductModel.bulkWrite(bulkOptions, {});
        //5- Clear cart depend on cartId  
        await CartModel.findByIdAndDelete(cartId);
    }
}

//@desc Webhook will run when stripe payment success paid
//@route Post /webhook-checkout
//@accsee Private/Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        console.log('Create order here...');
        console.log(event.data.object.client_reference_id);
        createCartOrder(event.data.object);
    }
    res.status(200).json({ received: true });
})



