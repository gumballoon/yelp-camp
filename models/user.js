const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// PASSPORT implementation for Moongoose (to simplify the whole process)
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    // field to allow the recovering of the password
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// to add onto the schema the fields: 1. username 2. password + methods like .authenticate() which will be used by PASSPORT
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;