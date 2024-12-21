import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoute from './routes/authRoute'

import { errorHandler } from './middlewares/errorHandler'
import { authMiddleware } from './middlewares/authMiddleware'
dotenv.config()

const app=express()
const PORT=process.env.PORT

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler) //handles errors from routes

//routes
app.use("/api/auth",authRoute)
app.listen(PORT,()=>console.log(`Server listening on PORT-${PORT}`))