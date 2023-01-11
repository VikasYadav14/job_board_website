const mongoose = require("mongoose");

const Id = mongoose.Schema.Types.ObjectId

const jobPostSchema = new mongoose.Schema({
    title: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    skills: {
        type: Array,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    userId: {
        type: Id,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('job', jobPostSchema)