const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

// MONGODB connection
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected to the database"))
  .catch((err) => console.log(err));

// Schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);

// API routes
app.get("/", (req, res) => {
  res.send("server is running");
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    console.log(result);
    console.log(err);
    //if the email id is available
    if (result) {
      res.send({ message: "Email id already exists", alert:false});
    } else {
      //to save email id
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully signed up" ,alert: true});
    }
  });
});


//login api

app.post("/login",(req,res)=>{
  console.log(req.body)

})

app.listen(PORT, () => console.log("server is running at: " + PORT));
