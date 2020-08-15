const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//preferred method using asyinc and await
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
//TODO when ready with production change build to put URL in key_ 's files then add to the ENV on heroku
