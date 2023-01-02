
const factory = require('./handlerFactory');
const ReviewModel = require('../models/reviewModel');


// Nested route
// GET /api/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
};

//@desc Get all Review
//@route Get /api/Review
//@accsee Public
exports.getReviews = factory.getAll(ReviewModel);

//@desc Get Review by id
//@route Get /api/Review/:id
//@access Public
exports.getReviewById = factory.getOne(ReviewModel);

//apply nested route in create
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product)
        req.body.product = req.params.productId;
    if (!req.body.user)
        req.body.user = req.user._id;
    next();
}

//@desc Create Review
//@route Post /api/Review
//@accsee Private/Protect/User
exports.createReview = factory.createOne(ReviewModel);

//@desc Put Review by id
//@route Put /api/Review/:id
//@access Private/Protect/User
exports.updateReview = factory.updateOne(ReviewModel);


//@desc Delete Review by id
//@route Delete /api/Review/:id
//@access Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(ReviewModel);
