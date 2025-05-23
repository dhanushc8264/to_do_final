import express from 'express'
import dotenv from "dotenv"
import connectDb from './config/db.js'
import cors from 'cors'
import router from './routes/taskRoutes.js'
import authRoutes from './routes/AuthRoutes.js'



dotenv.config()


//Database config
connectDb()





const app = express()
app.use(express.json())
app.use(cors({
    origin: '*',
    methods : ['GET','POST','PUT','DELETE','PATCH']
}));

app.options('*', cors());

const PORT = process.env.PORT

app.get('/' , (req,res)=>{
    res.send({
        message : "Welcome"
    })
})

app.use('/api/tasks',router)
app.use('/api/auth' , authRoutes)




app.listen(8000 , ()=>{
    console.log(`Server running successfully on ${PORT}`)
})