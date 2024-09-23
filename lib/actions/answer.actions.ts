"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "./mongoose";
import {
  CreateAnswerParams,
  GetAnswersParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // Add interaction

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  const { questionId } = params;
  try {
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });
    await connectToDatabase();

    return {
      answers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
