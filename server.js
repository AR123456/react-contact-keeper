const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

//connect Database
connectDB();
//init Middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

// serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // set static folder
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}
// post build in package .json
// server set up
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
