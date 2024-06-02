// models/DbNode.ts
// import mongoose, { Document, Model, Schema } from 'mongoose'

// // インターフェースの定義
// interface IIFDBNode extends Document {
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

// // スキーマの定義
// const IFDBNodeSchema: Schema = new Schema({
//   _id: { type: Number, required: true },
//   id: { type: String, required: true },
//   code: { type: String, required: true },
//   subCode: { type: String, required: true },
//   label: { type: String, required: true },
//   name: { type: String, required: true },
//   parent: { type: String, required: true },
//   type: { type: String, required: true },
//   description: { type: String, required: true }
// })

// // モデルの定義
// const IFDBNode: Model<IIFDBNode> = mongoose.models.IFDBNode || mongoose.model<IIFDBNode>('IFDBNode', IFDBNodeSchema)

// export default IFDBNode

//---------------------

import mongoose from 'mongoose'

const Schema = mongoose.Schema
const NodeSchema = new Schema({
  _id: { type: Number, required: true },
  id: { type: String, required: true },
  code: { type: String, required: true },
  subCode: { type: String, required: true },
  label: { type: String, required: true },
  name: { type: String, required: true },
  parent: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true }
})

// let NodeModel
// try {
//   NodeModel = mongoose.models.Node || mongoose.model('Node', NodeSchema)
// } catch (error) {
// } finally {
// }

// export { NodeModel }
export const NodeModel = mongoose.models?.Node || mongoose.model('Node', NodeSchema)
