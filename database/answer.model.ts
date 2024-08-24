import { Schema, model, models, Document } from "mongoose";

export interface IAnswer extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  upVotes: Schema.Types.ObjectId[];
  downVotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  upVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
