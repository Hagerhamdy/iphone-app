const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const brandRoute = require('./brandRoute');
const productRoute = require('./productRoute');
const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const reviewRoute = require('./reviewRoute');
const wishlistRoute = require('./wishlistRoute');
const addressRoute = require('./addressRoute');
const couponRoute = require('./couponRoute');
const cartRoute = require('./cartRoute');
const orderRoute = require('./orderRoute');


const mountRoutes = (app) => {
    app.use('/api/category', categoryRoute);
    app.use('/api/subcategory', subCategoryRoute);
    app.use('/api/brand', brandRoute);
    app.use('/api/product', productRoute);
    app.use('/api/user', userRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/review', reviewRoute);
    app.use('/api/wishlist', wishlistRoute);
    app.use('/api/address', addressRoute);
    app.use('/api/coupon', couponRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/order', orderRoute);
}

module.exports = mountRoutes;
