const { isValidEmail, isValidPassword } = require("../auth")
const applicationModel = require("../models/applicationModel")
const jobPostModel = require("../models/jobPostModel")


const postJob = async (req, res) => {
    try {
        let { title, email, skills } = req.body

        if (!req.body) return res.status(400).send({ error: 'Please provide mandatory fields' })
        const data = { ...req.body }

        if (!title) return res.status(400).send({ error: 'title is mandatory' })

        if (skills) {
            skills = skills.split(",").map((e) => e.trim())
            data.skills = skills
        }
        if (!email) {
            data.email = data.logEmail
        }
        if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' })
        data.userId = data.Id
        const job = await jobPostModel.create(data)

        return res.status(201).send({ message: "Job is successfully Posted", data: job })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params
        let { email, skills } = req.body

        if (!req.body) return res.status(400).send({ error: 'Please provide mandatory fields' })
        const data = { ...req.body }

        if (skills) {
            skills = skills.split(",").map((e) => e.trim())
            data.skills = skills
        }

        if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' })

        const job = await jobPostModel.findByIdAndUpdate(jobId, data, { new: true })

        return res.status(200).send({ message: "Job is successfully updated", data: job })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const deleteJob = async (req, res) => {
    try {
        let { jobId } = req.params

        const job = await jobPostModel.findById(jobId)
        if (!job) return res.status(404).send({ error: "post doesn't exist" })

        await jobPostModel.deleteOne({ _id: jobId })

        return res.status(200).send({ message: "Job is successfully deleted" })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const jobDatabyId = async (req, res) => {
    try {
        const { jobId } = req.params
        const { Id } = req.body

        let jobdata = await jobPostModel.findById(jobId).select({ createdAt: 0, updatedAt: 0, __v: 0 }).lean()
        if (!jobdata) return res.status(404).send({ error: "post doesn't exist" })

        if (jobdata.userId != Id) {
            return res.send(200).send({ message: 'Job details', data: jobdata })
        }
        let application = await applicationModel.find({ jobId }).select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (!application.length) {
            jobdata.application = "No applicant is applied"
            return res.status(200).send({ message: 'Job details', data: jobdata })
        }
        jobdata.No_of_applications = application.length
        jobdata.application = [...application]

        return res.status(200).send({ message: 'Job details', data: jobdata })

    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const searchJob = async (req, res) => {
    try {
        let { title, email, skills, experience } = req.body

        const query = {}
        if (title) query.title = title
        if (email) {
            if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' })
            query.email = email
        }
        if (skills) {
            skills = skills.split(",").map((e) => e.trim())
            query.skills = { $all :  skills }
            console.log(query.skills)
        }
        if (experience) query.experience = experience

        const jobs = await jobPostModel.find(query)

        return res.status(201).send({ message: "All job posts", "Number of Posts": jobs.length, data: jobs })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = { postJob, updateJob, deleteJob, jobDatabyId, searchJob }