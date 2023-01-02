const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    cartItems: [{
        product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number
    }],
    totalCartPrice: {
        type: Number
    },
    totalPriceAfterDiscount: {
        type: Number
    },
    user: {
        type: mongoose.Schema.ObjectId, ref: 'User'
    }
}, { timestamps: true })

module.exports = mongoose.model('Cart', CartSchema);

