const express= require("express")
const cors=require("cors")
const mongoose=require("mongoose")

const app=express()
app.use(cors())
app.use(express.json({limit : " 10mb"}))

const PORT=process.env.PORT || 8080

//making api
app.get("/",(req,res)=>{
    res.send("server is running")
})

app.post("/signup",(req,res)=>{
    console.log(req.body)
})



//to see which port app is running
app.listen(PORT,()=>console.log("server is runnint at :"+PORT))