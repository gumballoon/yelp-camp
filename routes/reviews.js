const express = require('express');
const router = express.Router({ mergeParams: true }); // to have access to the :id param (from app.js)
const { isLoggedIn, validateReview, isReviewAuthor } = require('../utilities/middleware');

// to import the controller object w/ all the route functions
const reviews = require('../controllers/reviews');

// CREATE route
router.post('/', isLoggedIn, validateReview, reviews.createReview)

// DESTROY route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.destroyReview)

module.exports = router;