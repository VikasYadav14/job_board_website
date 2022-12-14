const studentModel = require('./schema');

async function registerStudent(req, res) {
  try {
    const { name, subject, marks } = req.body;
    const teacherId = req.teacherId;
    req.body.teacherId = teacherId;
    if (!name)
      return res
        .status(400)
        .send({ status: false, message: 'Student name is must' });
    if (!subject) return res.status(400).send({ message: 'subject is must' });
    req.body.subject = subject.toLowerCase();
    if (!marks) return res.status(400).send({ message: 'marks is must' });

    const student = await studentModel.create(req.body);
    return res.status(201).json({ status: true, student });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

async function getStudents(req, res) {
  try {
    if (!req.query) {
      const student = await studentModel.find();
      if (student.length == 0)
        return res
          .status(404)
          .json({ status: false, message: 'No students found' });
      return res.status(200).send({ status: true, student });
    }
    const student = await studentModel.find(req.query);
    if (student.length == 0)
      return res
        .status(404)
        .json({ status: false, message: 'No students found' });
    return res.status(200).send({ status: true, student });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

async function updateStudents(req, res) {
  try {
    let { name, subject, marks } = req.body;
    subject = subject.toLowerCase();

    const studentId = req.params.studentId;

    const student = await studentModel.findByIdAndUpdate(
      { _id: studentId },
      { name, subject, $inc: { marks: marks } },
      { new: true }
    );
    if (!student)
      return res
        .status(404)
        .json({ status: false, message: 'No students found' });
    return res.status(200).send({ status: true, student });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

async function deleteStudents(req, res) {
  try {
    const studentId = req.params.studentId;

    const data = await studentModel.findByIdAndDelete(studentId);
    if (!data)
      return res
        .status(404)
        .json({ status: false, message: 'No students found' });
    return res.status(200).send({ status: true, message: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = {
  registerStudent,
  getStudents,
  updateStudents,
  deleteStudents,
};
