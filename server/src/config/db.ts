import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || 'your_mongodb_connection_string_here'

    if (mongoURI === 'your_mongodb_connection_string_here') {
      console.warn(
        'MONGO_URI is not defined. Using placeholder connection string.'
      )
    }

    await mongoose.connect(mongoURI, {})
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error((error as Error).message)
    process.exit(1)
  }
}

export default connectDB
