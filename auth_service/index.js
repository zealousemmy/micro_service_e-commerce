const express = require("express");
const User = require("./User");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Auth service DB Connected");
  }
);

app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already exists" });
  } else {
    const newUser = new User({ name, email, password });
    newUser.save();
    return res.json(newUser);
  }
});
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User does not exist" });
  } else {
    // password validation
    if (password !== user.password) {
      return res.json({ message: "password incorrect" });
    }
    const payload = {
      email,
      name: user.name,
    };
    jwt.sign(payload, "secret", (err, token) => {
      err ? console.log(err) : res.json({ token: token });
    });
  }
});
app.listen(port, () => {
  console.log(`listening to ${port} at auth service`);
});
