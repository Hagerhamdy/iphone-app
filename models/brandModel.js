const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand is required'],
        unique: [true, 'Brand is unique'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: { type: String }
}, { timestamps: true })

const setImageUrl = (doc) => {
    const imageUrl = `${process.env.BASE_URL}/brand/${doc.image}`;
    doc.image = imageUrl;
} 

//set image name in db and url in response with (find all, find by id, update)
BrandSchema.post('init', (doc) => {
    setImageUrl(doc);
})

//set image name in db and url in response with (create)
BrandSchema.post('save', (doc) => {
    setImageUrl(doc);
})

const brandModel = mongoose.model('Brand', BrandSchema);

module.exports = brandModel;