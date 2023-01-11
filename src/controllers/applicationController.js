const { isValidName, isValidEmail } = require("../auth")
const applicantModel = require("../models/applicantModel")
const applicationModel = require("../models/applicationModel")
const jobPostModel = require("../models/jobPostModel")


const applyJob = async (req, res) => {
    try {
        const { name, email } = req.body
        const { resume, coverLetter } = req.files
        const { jobId } = req.params
        const data = { ...req.body }

        if (!resume) return res.status(400).send({ error: 'resume is required' })
        if (!coverLetter) return res.status(400).send({ error: 'cover Letter is required' })
        if(!name) return res.status(400).send({ error: 'name is required' })
        if(!email) return res.status(400).send({ error: 'email is required' })

        if (resume[0].mimetype != "application/pdf") {
            return res.status(400).send({ error: 'Only .pdf and .docx format allowed! for Resume' })
        }
        if (coverLetter[0].mimetype != "text/markdown") {
            return res.status(400).send({ error: 'Only .md format allowed! for cover Letter' })
        }
        data.resume = resume[0].path
        data.coverLetter = coverLetter[0].path
        data.applicantId = data.Id

        const checkJob = await jobPostModel.findById(jobId)
        if (!checkJob) return res.send(404).send({ error: `No job foun on id ${jobId}` })
        data.jobId = jobId

        if (!isValidName(name)) return res.status(400).send({ error: 'name should be proper format' })
        if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' })

        const application = await applicationModel.create(data)

        return res.status(201).send({ message: 'job apply successfully', data: application })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const updateApplication = async (req, res) => {
    try {
        const { applicationId } = req.params
        const { name, email } = req.body
        const { resume, coverLetter } = req.files
        const data = { ...req.body }

        if (resume) {
            if (resume[0].mimetype != "application/pdf") {
                return res.status(400).send({ error: 'Only .pdf and .docx format allowed! for Resume' })
            }
            data.resume = resume[0].path
        }
        if (!coverLetter) {
            if (coverLetter[0].mimetype != "text/markdown") {
                return res.status(400).send({ error: 'Only .md format allowed! for cover Letter' })
            }
            data.coverLetter = coverLetter[0].path
        }
        if (name) { if (!isValidName(name)) return res.status(400).send({ error: 'name should be proper format' }) }
        if (email) { if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' }) }

        const application = await applicationModel.findByIdAndUpdate(applicationId, data, { new: true })

        return res.status(200).send({ message: 'application successfully updated', data: application })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const deleteApplication = async (req, res) => {
    try {
        let { applicationId } = req.params

        const application = applicationModel.findById({ _id: applicationId })
        if (!application) return res.status(404).send({ error: "post doesn't exist" })

        await applicationModel.deleteOne({ _id: applicationId })

        return res.status(200).send({ message: "application is successfully deleted" })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const getAllApplication = async (req, res) => {
    try {
        const { Id } = req.body
        const userdata = await applicantModel.findById(Id).select({ createdAt: 0, updatedAt: 0, __v: 0 }).lean()

        let application = await applicationModel.find({ applicantId: Id }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!application.length) {
            userdata.applications = "You are not yet apply any job"
            return res.status(200).send({ message: 'Application details', data: userdata })
        }
        userdata.No_of_applications = application.length
        userdata.applications = [...application]

        return res.status(200).send({ message: 'Application details', data: userdata })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const getApplicationbyId = async (req, res) => {
    try {
        const { applicationId } = req.params
        const application = await applicationModel.findById(applicationId).populate('jobId')

        return res.status(200).send({ message: 'Data fetch successfully', data: application })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = { applyJob, updateApplication, deleteApplication, getAllApplication, getApplicationbyId }