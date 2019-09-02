const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

// connect to db method one ( not using async and await )
// const connectDB = () => {
//   mongoose
//     .connect(db, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false
//     })
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => {
//       console.log(err.message);
//       process.exit(1);
//     });
// };
//preferred method using asyinc and await
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
