const mongoose = require("mongoose");
const Id = mongoose.Schema.Types.ObjectId

const applicantionSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim :true,
        required:true

    },
    email: {
        type: String,
        required:true
    },
    resume: {
        type: String,
        required:true
    },
    coverLetter:{
        type:String,
    },
    jobId:{
        type:Id,
        ref:'job',
        required:true
    },
    applicantId:{
        type:Id,
        ref:'applicant'
    }
}, { timestamps: true })

module.exports = mongoose.model('application', applicantionSchema)