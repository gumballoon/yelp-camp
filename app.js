// if in the development stage, DOTENV will extract to process.env the environment variables stored in the file .env 
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    // console.log(process.env.SECRET)
}

// to test the PRODUCTION views (i.e. hide stack trace on errors)
// require('dotenv').config();

// EXPRESS setup
const express = require('express');
const app = express(); // to create a server object, a local server on the machine
app.use(express.urlencoded({ extended: true })) // to parse form data in POST request body
app.use(express.json()) // to parse incoming JSON in POST request body

// EJS setup
app.set('view engine', 'ejs'); // to set the templating engine (EJS)
const ejsMate = require('ejs-mate'); // EJS engine to add layout functionalities
app.engine('ejs', ejsMate); // to set the engine to run/parse EJS
const path = require('path'); // module for working w/ file & directory paths
app.set('views', path.join(__dirname, '/views')); // to associate the VIEWS dir w/ the app dir

// METHOD OVERRIDE setup
const methodOverride = require('method-override'); // to 'fake' put/patch/delete requests
app.use(methodOverride('_method')); // query string parameter for the HTTP verb

app.listen(3000, () => console.log('Listening on port 3000...')); // to set the server on the port 3000
app.use(express.static(path.join(__dirname, '/public'))); // to share the directory w/ the public assets (CSS, JS)

const morgan = require('morgan'); // to get info logs on each received request
app.use(morgan('tiny')); // to print basic info

// MONGO setup
const mongoose = require('mongoose');
const dbURL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'; // production DB vs. development DB
mongoose.connect(dbURL) // to connect to a specific database
    .then(() => {
        console.log("Connection w/ MongoDB: Open")
    })
    .catch(err => {
        console.log("Connection w/ MongoDB: Error")
        console.log(err)
    })

// MONGO-SANITIZE setup
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({
    replaceWith: '_' // to replace any forbidden characters (i.e. $)
}))

// SESSION setup w/ CONNECT-MONGO
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const secret = process.env.SECRET || '$3kr3t'; // production vs. development

const store = new MongoStore ({
    url: dbURL,
    secret,
    touchAfter: 24 * 60 * 60 // save every 24h w/o updates (+ prevent unnecessary saves from page reloads)
});
// to catch any generated errors
store.on('error', function(e) {
    console.log("Session Store Error", e)
})

const sessionOptions = {
    store, 
    name: 'sessionYelpCamp', // custom name to avoid using the default (connect.sid), which may be referenced by cross-site scripts
    secret, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // to expire in a week
        maxAge: 1000 * 60 * 60 * 24 * 7, // to have the maximum duration of a week
        httpOnly: true, // security feature: cookie is only accessible over HTTP (vs. JS) to mitigate cross-site script attacks
        // secure: true // cookie is only configured over secure connections (HTTPS, which localhost isn't)
    } 
}
app.use(session(sessionOptions)); // to implement sessions & store temporary data for each browser

// FLASH setup
const flash = require('connect-flash');
app.use(flash()); // to flash temporary messages

// PASSPORT setup
const passport = require('passport');
const LocalStrategy = require('passport-local'); // to plugin a local strategy (username + password) on PASSPORT
app.use(passport.initialize());
app.use(passport.session()); // to have persistent login sessions

const User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate())); // to use a specific strategy w/ an authentication method located on the model User

passport.serializeUser(User.serializeUser()); // how to store an instance data in the Session
passport.deserializeUser(User.deserializeUser()); // how to delete the stored instance data 

// HELMET setup
const helmet = require('helmet');
app.use(helmet());

// to configure HELMET's Content Security Policy directives
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxp2zkrch/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req, res, next) => {
    // to automatically send to the rendered template any flash messages that were defined during the req/res cycle
    res.locals.flash = req.flash();
    
    // to send the stored user info
    res.locals.currentUser = req.user;

    next();
})

// R O U T E S //
app.get('/', (req, res, next) => {
    res.render('campgrounds/home');
})

const campgroundRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewRoutes);

const userRoutes = require('./routes/users');
app.use('', userRoutes);

// DEAD END route
app.all('*', (req, res, next) => {
    // res.render('campgrounds/dead-end')
    next(new AppError('Page not found...', 404))
})

// E R R O R S //
const AppError = require('./utilities/AppError');

app.use((err, req, res, next) => {
    if (!err.status) err.status = 404;
    if (!err.message) err.message = "Something went wrong"
    res.status(err.status).render('campgrounds/error', { err })
})       