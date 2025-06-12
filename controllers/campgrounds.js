const AppError = require('../utilities/AppError');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')

// MAPBOX setup
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken});

module.exports.index = async (req, res, next) => {
    await Campground.find()
        .then(allCampgrounds => res.render('campgrounds/index', { allCampgrounds }))
        .catch(e => next(e))
}

// array w/ all cities w/ state (same format as in SEEDS)
const cities = require('../seeds/data/cities');
let citiesAndStates = []
for (city of cities){
    citiesAndStates.push(`${city.city}, ${city.state}`)
}
citiesAndStates.sort();

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new', { citiesAndStates }); // citiesAndStates will be used as location options
}

module.exports.createCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);

    // to assign a GeoJSON from the given location
    const geoData = await geocoder.forwardGeocode({
        query: newCampground.location,
        limit: 1
      })
        .send();
    newCampground.geometry = geoData.body.features[0].geometry;

    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    // to block any requests w/o images
    if (!newCampground.images) {
        req.flash('danger', "Campground must have at least one image");
        return res.redirect(`/campgrounds/new`) // GET request for the NEW page
    }
    newCampground.author = req.user._id;
    console.log(newCampground);
    await newCampground.save()
        .catch(e => next(new AppError(e.message, 500)))

    req.flash('success', 'Campground succefully created')
    res.redirect(`/campgrounds/${newCampground._id}`); // GET request for the SHOW page of the new instance
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    // to populate 'reviews' and, on each one, populate 'author'
    const foundCampground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    })
    .populate('author')
        .catch(e => next(new AppError(e.message, 500)))
    if (foundCampground) {
        res.render('campgrounds/show', { foundCampground })
    } else {
        req.flash('danger', 'Campground not found');
        res.redirect('/campgrounds');
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id)
        // citiesAndStates will be used as location options 
        .catch(e => next(new AppError(e.message, 500)))
    if (foundCampground) {
        res.render('campgrounds/edit', { foundCampground, citiesAndStates })
    } else {
        req.flash('danger', 'Campground not found');
        res.redirect('/campgrounds');
    }
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const newImages = req.files.map(f => ({url: f.path, filename: f.filename}));

    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new:true})
        .catch(e => next(new AppError(e.message, 500)))
    
    // if all the images were deleted and there are no new images...
    if (req.body.deleteImages && req.body.deleteImages.length === updatedCampground.images.length && !newImages.length) {
        req.flash('danger', "Campground must have at least one image");
        return res.redirect(`/campgrounds/${updatedCampground._id}/edit`) // GET request for the EDIT page of the instance (w/ the updated text fields)
    } else {
        // to delete the selected images (on MongoDB & Cloudinary)
        if (req.body.deleteImages) {
            await updatedCampground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename)
            }
        }

        // to add the new images on MongoDB
        updatedCampground.images.push(...newImages) // to spread the newImages content into the instance array

        await updatedCampground.save()
            .catch(e => next(new AppError(e.message, 500)))
        
        req.flash('success', 'Campground succefully updated');
        res.redirect(`/campgrounds/${updatedCampground._id}`) // GET request for the SHOW page of the updated instance
    }
}

module.exports.destroyCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
        .then(() => {
            req.flash('success', 'Campground succefully deleted');
            res.redirect('/campgrounds')
        })
        .catch(e => next(new AppError(e.message, 500)))
}