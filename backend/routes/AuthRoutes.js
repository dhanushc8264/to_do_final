import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/UserModel.js'
import express from 'express'
import protectedRoute from "../middlewares/AuthMiddleware.js";


const router = express.Router()


router.post('/register' , async(req,res)=>{
  try{
    
     const { name, email, password } = req.body

     if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
     

     let user = await User.findOne({email})

     if (user) {
        return res.status(400).send({
          success: false,
          message: "User already exists"
        });
      }

     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(password ,salt)

     user = new User({name,email,password : hashedPassword})
     await user.save()

     res.status(201).json({ success: true, message: "User registered successfully" });
  }
  catch(err){
          res.status(500).send({
            success : false,
            message : "user registeration failed",
            error : err.message
          })
  }
})


router.post('/login' , async(req,res)=>{
    try{
      
        const {email , password} = req.body

        if (!email || !password) {
          return res.status(400).json({ success: false, message: "Email and password are required" });
        }

       const user = await User.findOne({email})

       if(!user)
       {
          return res.status(400).send({
            success : false,
            message : "Invalid email or password"
          })
       }

       const match = await bcrypt.compare(password , user.password)

       if(!match)
       {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
       }

       const token = jwt.sign({userId : user.id} , process.env.JWT_SECRET ,{expiresIn : '7d'})

       res.json({ success: true, message: "Login successful", token });
    }
    catch(err){
        res.status(500).json({ success: false, message: "Error logging in", error: err.message });
    }
})

router.get("/user", protectedRoute, async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching user data", error: err.message });
  }
});

export default router;

