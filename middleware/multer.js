const multer = require("multer");

// Set Storage
let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    let ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    cb(null, file.fieldname + "_" + Date.now() + ext);
  },
});

store = multer({ storage: storage });
module.exports = store;
