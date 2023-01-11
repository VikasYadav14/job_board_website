const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim :true,
        required:true

    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    password: {
        type: String,
        required:true
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)