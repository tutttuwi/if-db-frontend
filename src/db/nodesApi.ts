// ** DB Access
import connectDB from 'src/db/ifdb/db'
import { NodeModel } from 'src/db/models/IFDBNode'

const test = async () => {
  connectDB().then(async () => {
    console.log('NodeModel')
    const findedNode = await NodeModel.findOne({})
    console.log(findedNode)
  })
}

export default test
