const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'user name required'],
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    phone: String,
    profileImg: String,
    password: {
        type: String,
        required: [true, 'user email required'],
        minLength: [6, 'Too short password']
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        }
    ],
    addresses: [
        {
            id: { type: mongoose.Schema.Types.ObjectId },
            alias: String,
            details: String,
            phone: String,
            city: String,
            postalCode: String
        }
    ]
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { return next() }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', UserSchema);
