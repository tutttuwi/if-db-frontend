import mongoose from 'mongoose'
let Schema = mongoose.Schema

// const IfDB = async () => {
;async () => {
  try {
    console.log(process.env.DB_API_KEY)
    await mongoose.connect(process.env.DB_API_KEY)
    console.log('success mongoDB')
  } catch (err) {
    console.log('Failure:Unconnected to MongoDB')
    // throw new Error()
  }
}

// export default IfDB

// スキーマ
var DbNode = new Schema({
  _id: Number,
  id: String,
  code: String,
  subCode: String,
  label: String,
  name: String,
  parent: String,
  type: String,
  description: String
})

module.exports = mongoose.model('DbNode', DbNode)
