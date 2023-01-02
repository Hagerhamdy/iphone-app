const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to user']
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        quantity: Number,
        color: String,
        price: Number
    }],
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String
    },
    totalOrderPrice: Number,
    paymentMethodType: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelevered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date


}, { timestamps: true });

OrderSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name profileImg email phone' })
        .populate({ path: 'cartItems.product', select: 'title imageCover' });
    next();
})

module.exports = mongoose.model('Order', OrderSchema);