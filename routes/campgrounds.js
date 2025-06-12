const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require('../utilities/middleware');

const multer = require('multer'); // middleware to parse the form's multipart data (i.e. files)
// const upload = multer({dest:'uploads'}) // local folder on the project's directory to host the uploaded files
const { storage } = require('../cloudinary/index');
const upload = multer({ storage }); // to store the uploaded files on the Cloudinary storage

// to import the controller object w/ all the route functions
const campgrounds = require('../controllers/campgrounds');

// INDEX & CREATE routes
router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('images', 3), validateCampground, campgrounds.createCampground)

// NEW route
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// SHOW, UPDATE & DESTROY routes
router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.destroyCampground)

// EDIT route
router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm)

module.exports = router;