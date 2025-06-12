const AppError = require('../utilities/AppError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../joiSchemas');

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // to store the current URL
        req.flash('danger', 'You must be logged-in');
        return res.redirect('/login');
    } else {
        return next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground.author.equals(req.user._id)) {
        req.flash('danger', "You don't have permission to edit this campground");
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const foundReview = await Review.findById(reviewId);
    if(!foundReview) {
        next(new AppError(errorMessage, 400));
    } else {
        if (!foundReview.author.equals(req.user._id)) {
            req.flash('danger', "You don't have permission to edit this review");
            res.redirect(`/campgrounds/${id}`);
        } else {
            next();
        }
    }
}


// to store the returnTo value on res.locals (since Passport will clear the session after a successful login)
module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
        next();
    } else {
        next();
    }
}

// JOI functions to validate the req.body before calling Mongoose
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        // to extract a single string w/ all the validation errors
        const allErrorMessages = error.details.map(e => e.message)
        const errorMessage = allErrorMessages.join(' ,')
        throw new AppError(errorMessage, 400)
    } else {
        return next();
    }
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        // to extract a single string w/ all the validation errors
        const allErrorMessages = error.details.map(e => e.message)
        const errorMessage = allErrorMessages.join(' ,')
        throw new AppError(errorMessage, 400)
    } else {
        return next();
    }
}