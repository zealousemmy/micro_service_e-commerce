const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/auth-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Order service DB Connected");
  }
);
app.use(express.json());
app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});
