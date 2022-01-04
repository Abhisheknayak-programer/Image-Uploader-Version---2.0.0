const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 4500;
require("../db/conn");
const store = require("../middleware/multer");
const StudentModel = require("../model/student_schema");
const public_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");

app.use(express.static(public_path));
app.use(express.json());

app.set("view engine", "hbs");
app.set("views", views_path);

// ROUTINGS //
app.get("/", async (req, res) => {
  const All_students = await StudentModel.find();
  res.render("index", { Student_Data: All_students });
});

app.post("/uploaddata", store.array("images", 12), (req, res, next) => {
  const files = req.files;

  if (!files) {
    const err = new Error("Please choose files");
    err.httpStatusCode = 400;
    return next(err);
  }

  // COVERT IMAGES INTO BASE 64 ENCODING
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path);

    return (encode_image = img.toString("base64"));
  });

  let result = imgArray.map((src, index) => {
    let fileImg = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };

    let newUpload = new StudentModel(fileImg);

    return newUpload
      .save()
      .then(() => {
        return {
          msg: `${files[index].originalname} img uploaded sucessfully..!`,
        };
      })
      .catch((error) => {
        if (error) {
          if (error.name === "MongoError" && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname} File is already Exists`,
            });
          }

          return Promise.reject({
            error:
              error.message || `Cannot Upload ${files[index].originalname}`,
          });
        }
      });
  });
  Promise.all(result)
    .then((msg) => {
      // res.json(msg);
      res.redirect("/");
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(port, () => {
  console.log(`OUR SERVER IS ACTIVE -> http://127.0.0.1:${port}`);
});
