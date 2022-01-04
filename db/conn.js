const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.as3ea.mongodb.net/DemoUploads?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("HEY WE ARE CONNECTED WITH THE DATABASE");
  })
  .catch((err) => {
    console.log(`ERROR FOUND :::: ${err}`);
  });
