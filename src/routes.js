const express = require('express')
const router = express.Router()

const { authentication, recAuthorization, appAuthorization } = require('./auth')

const { userRegister, login, userAllPost } = require('./controllers/userController')
const { postJob, updateJob, deleteJob, jobDatabyId, searchJob } = require('./controllers/jobPostController')

const { applicantRegister } = require('./controllers/applicantController')
const { applyJob, updateApplication, deleteApplication, getAllApplication, getApplicationbyId } = require('./controllers/applicationController')


// -------user api (recruiter)----//
router.post('/recruiter/register', userRegister)
router.get('/recruiter/login', login)

// ----recruiter can post job delete and edit-----//

router.post('/recruiter/postJob', authentication, postJob)
router.put('/recruiter/updateJob/:jobId', authentication, recAuthorization, updateJob)
router.delete('/recruiter/deleteJob/:jobId', authentication, recAuthorization, deleteJob)


// -----recruiter can get job details which he posted and also with their details of applied applications-----//
router.get('/recruiter/getJobdetails/:jobId', authentication, jobDatabyId)
router.get('/recruiter/getJobdetails', authentication, userAllPost)


//------applicant (ones apply for job)--------//
router.post('/applicant/register', applicantRegister)
router.get('/applicant/login', login)


//-----applicant can apply for job--------//
router.post('/applicant/applyJob/:jobId', authentication, applyJob)
router.put('/applicant/updateApplication/:applicationId', authentication, appAuthorization, updateApplication)
router.delete('/applicant/updateApplication/:applicationId', authentication, appAuthorization, deleteApplication)


// //------applicant can get all application details which he applied---------//
router.get('/applicant/getapplicationDetails', authentication, getAllApplication)
router.get('/applicant/getapplicationDetails/:applicationId', authentication, appAuthorization, getApplicationbyId)


// ----both user serach job post with filteration---------//
router.get('/searchJob', searchJob)


module.exports = router