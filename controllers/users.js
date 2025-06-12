const AppError = require('../utilities/AppError');
const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try { 
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        // to keep the user logged-in after a succefully registration
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', 'Welcome to YelpCamp!');
                res.redirect('/campgrounds');
            }
        })
    } catch(e) {
        req.flash('danger', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    // to retrieve the previous URL vs. default URL if there was none
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success', 'Welcome back to YelpCamp!');
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if(err) {
            req.flash('danger', err.message);
            res.redirect('/home');
        } else {
            req.flash('success', 'You have successfully logged-out');
            res.redirect('/home');
        }
    })
}