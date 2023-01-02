const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name:
        { type: String, trim: true, unique: [true, 'SubCategory must be unique'] },
    slug:
        { type: String, lowercase: true },
    category:
        { type: mongoose.Schema.ObjectId, ref: 'Category', required: [true, 'SubCategory must be belong to category'] }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);