const mongoose = require("mongoose");

const app = require("./routes/User");

const port = 5000;
const mongoURI = "mongodb://127.0.0.1:27017"; // Replace with your MongoDB connection URI

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
