import mongoose from 'mongoose'

const IfDB = async () => {
  try {
    console.log(process.env.DB_API_KEY)
    await mongoose.connect(process.env.DB_API_KEY)
    console.log('success mongoDB')
  } catch (err) {
    console.log('Failure:Unconnected to MongoDB')
    // throw new Error()
  }
}

export default IfDB
