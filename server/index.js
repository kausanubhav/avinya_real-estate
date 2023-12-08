import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
dotenv.config()

//DB config
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB")
  })
  .catch((err) => console.log(err))


const app = express()

app.use(express.json())
app.use(cookieParser())


app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500
    const message=err.message||"Internal Server Error"
    return res.status(statusCode).json({message,success:false,statusCode})
})

app.listen(3000, () => {
  console.log(`Server is running on port 3000`)
})


