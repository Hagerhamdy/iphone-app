const router = require('express').Router({ mergeParams: true });

const { getReviews, createReview, getReviewById, updateReview, deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody } =
    require('../services/reviewService');
const { createReviewValidator, updateReviewValidator, deleteReviewValidator } =
    require('../utils/validator/reviewValidator');
const authServive = require('../services/authService');



router.route('/').get(createFilterObj, getReviews)
    .post(authServive.protect, authServive.allowedTo('user'), setProductIdAndUserIdToBody,
        createReviewValidator, createReview);

router.route('/:id').get(getReviewById)
    .put(authServive.protect, authServive.allowedTo('user'), updateReviewValidator, updateReview)
    .delete(authServive.protect, authServive.allowedTo('admin', 'manager', 'user'), deleteReviewValidator, deleteReview);


module.exports = router;  