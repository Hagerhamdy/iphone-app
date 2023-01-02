const mongoose = require('mongoose');
const ProductModel = require('./productModel');

const ReviewSchema = new mongoose.Schema({
    title: { type: String },
    ratings: {
        type: Number,
        min: [1, 'Min ratings value = 1.0'],
        max: [5, 'Min ratings value = 5.0'],
        required: [true, 'Review ratings required']
    },
    user: {
        type: mongoose.Schema.ObjectId, ref: 'User',
        required: [true, 'Review must belong to user']
    },
    product: {
        type: mongoose.Schema.ObjectId, ref: 'Product',
        required: [true, 'Review must belong to product']
    },
}, { timestamps: true })

ReviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name' });
    next();
})

//mdw calc Average and Quantity Ratings
ReviewSchema.statics.calcAverageRatingsAndQuantity = async function (productId) {
    const result = await this.aggregate([
        //stage 1 : Get all reviews specific productId
        {
            $match: { product: productId }
        },
        //stage 2 : Grouping reviews based on productId and calc avgRatings, qtyRatings
        {
            $group: {
                _id: '$product',
                avgRatings: { $avg: '$ratings' },
                qtyRating: { $sum: 1 }
            }
        }
    ])
    // console.log(result);
    if (result.length > 0) {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingAverage: result[0].avgRatings,
            ratingsQuantity: result[0].qtyRating
        })
    } else {
        await ProductModel.findByIdAndUpdate(productId, {
            ratingAverage: 0,
            ratingsQuantity: 0
        })
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
})

ReviewSchema.post('remove', async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.product);
})

module.exports = mongoose.model('Review', ReviewSchema);