const mongoose = require('mongoose');

const Scehma = mongoose.Schema;

const UserScehma = new Scehma({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.png",
    },
}, { timestamps: true });

const User = mongoose.model('User', UserScehma);
module.exports = User;