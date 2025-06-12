const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../utilities/middleware');

// to import the controller object w/ all the route functions
const users = require('../controllers/users');

// REGISTER routes
router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser)

// LOGIN routes
router.route('/login')
    .get(users.renderLoginForm)
    
    // to validate the credentials & store the user info on the session (req.user)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser)

// LOGOUT
router.get('/logout', users.logoutUser)

module.exports = router;