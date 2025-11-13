const mongoose = require('mongoose');
const dbURL = process.env.DB_URL;
mongoose.connect(dbURL) // to connect to a specific database
    .then(() => {
        console.log("Connection w/ MongoDB: Open")
    })
    .catch(err => {
        console.log("Connection w/ MongoDB: Error")
        console.log(err)
    })

// to import the models
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

// to import the random data
const cities = require('./data/cities');
const { descriptors, places } = require('./data/random-name');
const reviews = require('./data/reviews');
const descriptions = require('./data/descriptions');

// to get a random element out of an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// function to be executed every time the model is updated (in order to reset the collection w/ new instances)
async function seedDB() {
    // to delete all instances of Campground, Review & User
    await Campground.deleteMany({})
        .then(() => console.log('All campgrounds have been deleted.'))
        .catch(e => console.log(e))

    await Review.deleteMany({})
    .then(() => console.log('All reviews have been deleted.'))
    .catch(e => console.log(e))

    await User.deleteMany({})
    .then(() => console.log('All users have been deleted.'))
    .catch(e => console.log(e))

    // to seed the Users collection
    for (let username of ['jerry', 'george', 'elaine', 'kramer', 'newman']) {
        const newUser = new User({
            username,
            email: `${username}@gmail.com`
        });
        
        await User.register(newUser, `${username}pass`);
    }
    const allUsers = await User.find({});

    // to create & store 90 new instances on the randomReviews array
    let randomReviews = [];
    for (let i = 0; i < 900; i++){
        randomReviews.push(new Review({
            date: getRandomElement(['2025-01-01', '2025-02-14', '2025-03-19', '2025-04-25']),
            body: getRandomElement(reviews),
            rating: getRandomElement([1, 2, 3, 4, 5]),
            author: getRandomElement(allUsers)._id
        }))
    }

    await Review.insertMany(randomReviews)
        .then(() => console.log('900 random Reviews have been inserted.'))
        .catch(e => console.log(e))

    let allReviews = await Review.find({});

    const defaultImages = [
        {
          url: 'https://res.cloudinary.com/dxp2zkrch/image/upload/v1748600325/YelpCamp/jcsh6btsdvpemrvkgnxm.jpg',
          filename: 'YelpCamp/jcsh6btsdvpemrvkgnxm'
        },
        {
          url: 'https://res.cloudinary.com/dxp2zkrch/image/upload/v1748521912/YelpCamp/enxnly9rpoc8fnjibyp5.jpg',
          filename: 'YelpCamp/enxnly9rpoc8fnjibyp5'
        },
        {
          url: 'https://res.cloudinary.com/dxp2zkrch/image/upload/v1748521912/YelpCamp/outxayewiipqdd06741b.jpg',
          filename: 'YelpCamp/outxayewiipqdd06741b'
        }
      ]

    // to create & store 300 new instances on the randomCamps array
    let randomCamps = [];
    for (let i = 0; i < 300; i++){
        const randomCity = getRandomElement(cities);
        
        let threeReviews = [];
        for (let i = 0; i < 3; i++){
            // take the last element out of allReviews into threeReviews
            threeReviews.push(allReviews.pop());
        }

        randomCamps.push(new Campground({
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`, // random combination of the two arrays
            location: `${randomCity.city}, ${randomCity.state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    randomCity.longitude,
                    randomCity.latitude
                ]
            },
            price: Math.floor(Math.random() * 20) + 10, // to offset the values so they start at 10 and go up to 30
            images: [getRandomElement(defaultImages)],
            description: getRandomElement(descriptions),
            reviews: threeReviews,
            author: getRandomElement(allUsers)._id
        }))
    }

    await Campground.insertMany(randomCamps)
        .then(() => console.log('300 random Campgrounds have been inserted.'))
        .catch(e => console.log(e))
}

// to close the connection to MongoDB after execution, so the terminal won't stay on hold
seedDB()
    .then(() => mongoose.connection.close())
    .catch(e => console.log(e))