const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category is required'],
        unique: [true, 'Category is unique'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: { type: String }
}, { timestamps: true })

const setImageUrl = (doc) => {
    const imageUrl = `${process.env.BASE_URL}/category/${doc.image}`;
    doc.image = imageUrl;
} 

//set image name in db and url in response with (find all, find by id, update)
CategorySchema.post('init', (doc) => {
    setImageUrl(doc);
})

//set image name in db and url in response with (create)
CategorySchema.post('save', (doc) => {
    setImageUrl(doc);
})

const categoryModel = mongoose.model('Category', CategorySchema);

module.exports = categoryModel;