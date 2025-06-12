const AppError = require('../utilities/AppError');
const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req, res, next) => {
    const { review } = req.body;
    review.date = new Date();
    const newReview = new Review(review);
    newReview.author = req.user._id;
    await newReview.save()
        .then((rev) => console.log(rev))
        .catch(e => next(new AppError(e.message, 500)))

    const { id } = req.params; 
    const foundCampground = await Campground.findById(id)
        .catch(e => next(new AppError(e.message, 500)))
    foundCampground.reviews.push(newReview) // to associate the 2 models
    await foundCampground.save()
        .then((camp) => console.log(camp))
        .catch(e => next(new AppError(e.message, 500)))

    req.flash('success', 'Review succefully added');
    res.redirect(`/campgrounds/${id}`) // GET request for the SHOW page of the campground
}

module.exports.destroyReview = async(req, res, next) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
        .catch((e) => next(new AppError(e.message, 500)))
    await Campground.findByIdAndUpdate({_id: id}, {$pull: {reviews: reviewId}}) // to remove a specific element from the array
        .catch((e) => next(new AppError(e.message, 500)))
    req.flash('success', 'Review succefully deleted');
    res.redirect(`/campgrounds/${id}`) // GET request for the SHOW page of the campground
}