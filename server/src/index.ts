import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import cors from 'cors'
import transporter from './config/transporter'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'
dotenv.config()

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error)
  } else {
    console.log('SMTP connection successful:', success)
  }
})

const app = express()
app.use(cors())

app.use(express.json())

connectDB()
app.use('/api/auth', authRoutes)

app.use('/api/tasks', taskRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
