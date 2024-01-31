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
      res.send({ message: "Email id already exists", alert: false });
    } else {
      //to save email id
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully signed up", alert: true });
    }
  });
});

//login api

app.post("/login", (req, res) => {
  console.log(req.body);
  //extracting email
  const { email } = req.body;
  userModel.findOne({ email: email }, (err, result) => {
    //if email is already registered , it will give data
    if (result) {
      //inputing results value into datasend
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
//sending data through datasend
      res.send({ message: "login successfull", alert: true ,data:dataSend});
    }
    else{
      res.send({ message: "Email is not available, please sign up", alert: false});

    }
  });
});

//product section
const schemaProduct=mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
})
const productModel=mongoose.model("product",schemaProduct)

//save product in data api
app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data=await productModel(req.body)
  const datasave=await data.save()

  res.send({message:"Uploaded Successfully"})
})


//get products api
app.get("/product",async(req,res)=>{
  const data=await productModel.find({})
  res.send(JSON.stringify(data))
})
app.listen(PORT, () => console.log("server is running at: " + PORT));
