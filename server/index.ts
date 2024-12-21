import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'

import authRoute from './routes/authRoute'
dotenv.config()

const app=express()
const PORT=process.env.PORT

//middlewares
app.use(express.json())
app.use(errorHandler) //handles errors from routes

//routes
app.use("/api/auth",authRoute)
app.listen(PORT,()=>console.log(`Server listening on PORT-${PORT}`))