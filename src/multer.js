const multer = require('multer')

const upload = multer({
  storage: multer.diskStorage({
    destination: './src/storage',
    filename: function (req, file, cb) {
      const fileType = file.originalname.split(".")[1]
      cb(null, `${Date.now()}.${fileType}`)
    }
  })
  // fileFilter: (req, file, cb) => {
  //   if (file.fieldname == 'coverLetter') {
  //     if (file.mimetype == "text/markdown") {
  //       cb(null, true);
  //     } else {
  //       cb(null, false);
  //       return cb(new Error('Only .md format allowed!'));
  //     }
  //   }
  //   else {
  //     if (file.mimetype == "application/pdf" || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
  //       cb(null, true);
  //     } else {
  //       cb(null, false);
  //       return cb(new Error('Only .pdf and .docx format allowed! for cover Letter'));
  //     }
  //   }
  // }

}).fields([{ name: 'resume' }, { name: 'coverLetter' }])

module.exports = upload