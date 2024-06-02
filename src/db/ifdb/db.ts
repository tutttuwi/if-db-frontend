// import mongoose from 'mongoose'

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_API_KEY)
//     console.log('MongoDB connected')
//   } catch (err) {
//     console.error('MongoDB connection error:', err)
//     process.exit(1)
//   }
// }
// export default connectDB

// ---------------------------

// import { MongoClient, Collection, ObjectId } from 'mongodb'

// const MONGODB_URI = 'mongodb://[user:password]@localhost:27017/example'

// export type School = {
//   _id?: ObjectId
//   name: string
// }

// export type Student = {
//   _id?: ObjectId
//   schoolId: ObjectId
//   name: string
// }

// export let collections= {
//   schools: Collection<School>,
//   students: Collection<Student>
// }

// export async function connect() {
//   const client = await MongoClient.connect(process.env.DB_API_KEY, {
//     useNewUrlParser: true
//   })

//   const db = client.db('example')
//   collections.schools = db.collection<School>('schools')
//   collections.students = db.collection<Student>('students')
// }

// import mongoose from 'mongoose'
// import { Schema, model, Document, Model, models } from 'mongoose'

// // MongoDBに接続する関数
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.DB_API_KEY, {
//       // useNewUrlParser: true,
//       // useUnifiedTopology: true
//     })
//     console.log('MongoDB connected...')
//   } catch (err) {
//     console.error(err)
//     // process.exit(1)
//   }
// }

// // ドキュメントのインターフェースを定義
// interface INode extends Document {
//   _id: Number
//   id: String
//   code: String
//   subCode: String
//   label: String
//   name: String
//   parent: String
//   type: String
//   description: String
// }

// // スキーマを定義
// const NodeSchema: Schema = new Schema({
//   _id: {
//     type: Number,
//     required: true
//   },
//   id: {
//     type: String,
//     required: true
//   },
//   code: {
//     type: String
//   },
//   subCode: {
//     type: String
//   },
//   label: {
//     type: String
//   },
//   name: {
//     type: String
//   },
//   parent: {
//     type: String
//   },
//   type: {
//     type: String
//   },
//   description: {
//     type: String
//   }
// })

// interface NodeModel extends Model<INode> {}

// // モデルを作成
// // const Node = model<INode>('Node', NodeSchema)

// // export default mongoose.model<UserDoc, UserModel>('User', userSchema)
// const Node = models.Node ? (models.Node as NodeModel) : mongoose.model<INode, NodeModel>('Node', NodeSchema)

// // ユーザーを取得する関数
// const getUsers = async () => {
//   try {
//     const nodes = await Node.find()
//     console.log(nodes)
//   } catch (err) {
//     console.error(err)
//   }
// }

// export function test() {
//   // データベース接続後にデータを取得
//   connectDB().then(getUsers)
// }

//----------------------

// import { MongoClient, Db, Collection } from 'mongodb'

// // MongoDBに接続する関数
// const connectDB = async (): Promise<Db> => {
//   const uri = process.env.DB_API_KEY
//   const client = new MongoClient(uri)

//   try {
//     await client.connect()
//     console.log('MongoDB connected...')
//     const db = client.db('your_database_name')
//     return db
//   } catch (err) {
//     console.error(err)
//     throw err
//   }
// }

// // コレクションからデータを取得する関数
// export const getNodes = async () => {
//   // const db = await connectDB()
//   // const nodesCollection: Collection = db.collection('node')
//   // try {
//   //   const nodes = await nodesCollection.find().toArray()
//   //   console.log(nodes)
//   // } catch (err) {
//   //   console.error(err)
//   // }
// }

//-----------------------

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_API_KEY)
    console.log('succecc mongoDB')
  } catch (err) {
    console.log('Failure:Unconnected to MongoDB')
    // throw new Error()
  }
}

export default connectDB
