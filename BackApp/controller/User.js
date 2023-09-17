const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = "your-secret-key"; // Replace with your own secret key


function login(req, res) {
  const { phoneNumber, password } = req.body;

  User.findOne({ phoneNumber })
    .then((user) => {
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, phone: phoneNumber }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ token });
  })
    .catch((err) => {
            return res.status(401).json({ message: "Invalid credentials" });
    });
}

function signup(req, res) {
  const { phoneNumber, password } = req.body;
  // console.log(phoneNumber,password)

  const newUser = new User({ phoneNumber, password });

  newUser.save().then(() => {

    const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: "1h" });

    res.json({ token });
  })
    .catch((err) => {
            if (err.code === 11000) {
              return res
                .status(400)
                .json({ message: "Phone number already in use" });
            }
            return res.status(500).json({ message: "Error creating user" });
    });
}

module.exports = { login, signup };
