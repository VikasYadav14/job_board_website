const express = require('express');
const { authentication, authorization } = require('./Auth');
const {
    registerStudent,
    deleteStudents,
    updateStudents,
    getStudents,
} = require('./student/controller');

const router = express.Router();
const { registerTeacher, login } = require('./teacher/controller');

router.post('/teacher', registerTeacher);
router.get('/teacher/login', login);

router.post('/students/register', authentication, registerStudent);
router.get('/students', authentication, getStudents);
router.put(
    '/student/:studentId',
    authentication,
    authorization,
    updateStudents
);
router.delete(
    '/student/:studentId',
    authentication,
    authorization,
    deleteStudents
);
module.exports = router;
