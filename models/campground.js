const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const { cloudinary } = require('../cloudinary/index');
const { required } = require('joi');

const imageSchema = new Schema({
    url: String,
    filename: String
})

// to include the virtual properties on the result object
const options = { toJSON: {virtuals: true}}

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowcase: true
    },
    price: {
        type: Number,
        required: true,
        min: 10
    },
    location: {
        type: String,
        required: true,
        lowcase: true
    },
    geometry: { // to enforce the GeoJSON format 
        type: {
            type: String,
            required: true,
            enum: [ 'Point' ] // to enforce the value 'point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: {
        type: [ imageSchema ],
        required: true
    },
    description: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, options)

// to get a thumbnail of the stored image
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

// to get a croped version of the stored image (to the standard size of 1200x800)
imageSchema.virtual('carousel').get(function() {
    return this.url.replace('/upload', '/upload/c_fill,w_1200,h_800')
})

// to get the markup for the unclustered point
campgroundSchema.virtual('properties.popupHTML').get(function() {
    return `
   <div class="p-2 ps-0 pb-0">
        <a href="/campgrounds/${this._id}" class="text-dark text-decoration-none">
            <h5 class="mb-0">${this.title}</h5>
        </a>
        <small>${this.location}</small>
        <p class="text-muted mb-0">${this.description.substring(0,20)}...</p>
    </div>`
})

// to delete all associated reviews & Cloudinary images when deleting a campground
campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc) { // if something was succefully deleted
        await Review.deleteMany({_id: {$in: doc.reviews}})

        for(let i of doc.images) {
            await cloudinary.uploader.destroy(i.filename)
        }
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;