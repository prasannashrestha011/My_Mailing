import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoute from './routes/authRoute'
import { errorHandler } from './middlewares/errorHandler'
import { authMiddleware } from './middlewares/authMiddleware'
import { corsOptions } from './configs/corsConfig'
dotenv.config()

const app=express()
const PORT=process.env.PORT

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(errorHandler) //handles errors from routes
app.use(cors(corsOptions))

//routes
app.use("/api/auth",authRoute)
app.listen(PORT,()=>console.log(`Server listening on PORT-${PORT}`))