import mongoose, { Schema, Document } from 'mongoose'

interface ITask extends Document {
  task: string
  category: string
  browniePoints: number
  isTop3Day: boolean
  isTop3Week: boolean
  isCompleted: boolean
  createdBy: mongoose.Schema.Types.ObjectId
}

const TaskSchema: Schema = new Schema(
  {
    task: { type: String, required: true },
    category: { type: String, required: true },
    browniePoints: { type: Number, required: true },
    isTop3Day: { type: Boolean, default: false },
    isTop3Week: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Reference
  },
  { timestamps: true }
)

export default mongoose.model<ITask>('Task', TaskSchema)
