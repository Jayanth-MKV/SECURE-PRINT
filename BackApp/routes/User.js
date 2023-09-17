const express = require("express");
const bodyParser = require("body-parser");
const { login, signup } = require("../controller/User");
const path = require("path");
const app = express();

const bodyparser = require("body-parser");

/*assuming an express app is declared here*/
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/uploads"));

var cors = require("cors");
app.use(cors());
app.use(express.json());

app.post("/login", login);
app.post("/signup", signup);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(require("../routes/Pdf"));

module.exports = app;
