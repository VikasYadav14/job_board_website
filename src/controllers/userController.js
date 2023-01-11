const { isValidName, isValidEmail, isValidPassword } = require('../auth');
const applicantModel = require('../models/applicantModel');
const jobPostModel = require('../models/jobPostModel');
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!req.body) return res.status(500).send({ error: 'Please provide mandatory fields' })

        if (!isValidName(name)) return res.status(500).send({ error: 'name should be proper format' })

        if (!isValidEmail(email)) return res.status(500).send({ error: 'email should be in format' })

        if (!isValidPassword(password)) return res.status(400).send({
            error:
                'password is weak. use uppercase, lowercase, number and special character and minimum size 8',
        });

        const user = await userModel.create(req.body)

        return res.status(201).send({ message: "User is successfully register", data: user })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(email))
            return res.status(400).send({ error: 'email is not in correct format' });

        let user = await userModel.findOne({ email, password });
        if (!user) {
            user = await applicantModel.findOne({ email, password })
            if (!user) return res.status(400).send({ error: 'Credentials are incorrect' });
        }
        const token = jwt.sign({ email, Id:user._id }, 'secret key given by Vikas', {
            expiresIn: '1h',
        });
        return res.status(200).send({message:"successfully Login", token });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const userAllPost = async (req, res) => {
    try {
        const { Id } = req.body

        const userdata = await userModel.findById(Id).select({ createdAt: 0, updatedAt: 0, __v: 0 }).lean()
        const jobdata = await jobPostModel.find({ userId:Id }).select({ createdAt: 0, updatedAt: 0, __v: 0, userId: 0 })
        if(!jobdata.length){
            userdata.jobdata = "You are not yet apply any job"
            return res.status(200).send({ message: 'Job details', data: userdata })
        }
        userdata.No_of_Posts = jobdata.length
        userdata.All_Posts = [...jobdata]
        return res.status(200).send({ message: 'Job details', data: userdata })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}
module.exports = { userRegister, login, userAllPost }
