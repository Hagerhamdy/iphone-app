const router = require('express').Router();
const { createCashOrder, getAllOrder, filterOrderForLoggedUser, getOrderById,
    updateOrderToPaid, updateOrderToDelivered, checkoutSession } =
    require('../services/orderService');
const authServive = require('../services/authService');

router.use(authServive.protect);


router.route('/:cartId').post(authServive.allowedTo('user'), createCashOrder);

router.route('/').get(authServive.allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser, getAllOrder);
router.route('/:id').get(authServive.allowedTo('user', 'admin', 'manager'), getOrderById);
router.route('/checkout-session/:cartId').get(authServive.allowedTo('user'), checkoutSession);

router.put('/:id/pay', authServive.allowedTo('admin', 'manager'), updateOrderToPaid);
router.put('/:id/deliver', authServive.allowedTo('admin', 'manager'), updateOrderToDelivered);


module.exports = router;  