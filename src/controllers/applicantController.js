const { isValidName, isValidEmail, isValidPassword } = require("../auth");
const applicantModel = require("../models/applicantModel");


const applicantRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!req.body) return res.status(400).send({ error: 'Please provide mandatory fields' })

        if (!isValidName(name)) return res.status(400).send({ error: 'name should be proper format' })

        if (!isValidEmail(email)) return res.status(400).send({ error: 'email should be in format' })

        if (!isValidPassword(password)) return res.status(400).send({
            error:
                'password is weak. use uppercase, lowercase, number and special character and minimum size 8',
        });

        const user = await applicantModel.create(req.body)

        return res.status(201).send({message:"User is successfully register", data: user })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}


module.exports = {applicantRegister}