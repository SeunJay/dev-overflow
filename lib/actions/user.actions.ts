"use server";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
  const { userId } = params;

  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  const { clerkId, updateData, path } = userData;
  try {
    await connectToDatabase();

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

//
export async function deleteUser(params: DeleteUserParams) {
  const { clerkId } = params;
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments etc

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
