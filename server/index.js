import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import athleteRoutes from './routes/athleteRoutes.js'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', athleteRoutes)

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    }catch(error){
        console.log('MongoDB connection error',error)
        process.exit(1)
    }
}

connectDB()

app.get('/',(req,res)=>{
    res.send('hello world')
})

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`) 
})