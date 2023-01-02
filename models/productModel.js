const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    title: { type: String, required: true, trim: true, unique: [true, 'Product is unique'] },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: [true, 'Product must be have a description'] },
    quantity: { type: Number, required: true, trim: true },
    sold: { type: Number, default: 0 },
    price: { type: Number, required: true, trim: true },
    priceAfterDiscount: { type: Number, trim: true },
    colours: [String],
    images: [String],
    imageCover: { type: String, required: true },
    category: { type: mongoose.Schema.ObjectId, required: [true, 'Product must be belong to category'], ref: 'Category' },
    subCategory: [{ type: mongoose.Schema.ObjectId, ref: 'SubCategory' }],
    brand: { type: mongoose.Schema.ObjectId, ref: 'Brand' },
    ratingAverage: { type: Number, min: [1, 'Rating must be above or equal 1'], max: [5, 'Rating must be below or equal 5'] },
    ratingsQuantity: { type: Number, default: 0 }

}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

//add virual reviews to Product Model
ProductSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
})

ProductSchema.pre(/^find/, function (next) {
    this.populate({ path: 'category', select: 'name' });
    next();
});

const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/product/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const imagesList = [];
        doc.images.forEach(image => {
            const imageUrl = `${process.env.BASE_URL}/product/${image}`;
            imagesList.push(imageUrl);
        })
        doc.images = imagesList;
    }
}

//set image name in db and url in response with (find all, find by id, update)
ProductSchema.post('init', (doc) => {
    setImageUrl(doc);
})

//set image name in db and url in response with (create)
ProductSchema.post('save', (doc) => {
    setImageUrl(doc);
})

module.exports = mongoose.model('Product', ProductSchema);