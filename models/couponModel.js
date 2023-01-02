const mongoose = require('mongoose');


const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon is required'],
        unique: true
    },
    expire: {
        type: Date,
        required: [true, 'Coupon expire time is required']
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);