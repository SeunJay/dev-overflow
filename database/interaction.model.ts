import { Schema, model, models, Document } from "mongoose";

export interface IInteraction extends Document {
  action: string;
  question: Schema.Types.ObjectId;
  answer: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId;
  createdOn: Date;
}

const InteractionSchema = new Schema({
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", require: true },
  answer: { type: Schema.Types.ObjectId, ref: "Answer", require: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  createdOn: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
