"use server";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import { connectToDatabase } from "./mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getUserById(params: GetUserByIdParams) {
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

export async function getAllUsers(params: GetAllUsersParams) {
  const { searchQuery } = params;

  const query: FilterQuery<typeof User> = {};

  if (searchQuery) {
    query.$or = [
      {
        name: { $regex: new RegExp(searchQuery, "i") },
      },
      {
        username: { $regex: new RegExp(searchQuery, "i") },
      },
    ];
  }

  try {
    await connectToDatabase();
    const users = await User.find(query).sort({ createdAt: -1 });

    return { users };
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

export async function toggleSavedQuestion(params: ToggleSaveQuestionParams) {
  const { userId, questionId, path } = params;
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestioned = user.saved.includes(questionId);

    if (isQuestioned) {
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  const { clerkId, searchQuery } = params;

  try {
    await connectToDatabase();

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
          select: "_id name",
        },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const savedQuestions = user.saved as any[];

    return {
      questions: savedQuestions,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  const { userId } = params;

  try {
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found!");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  const { userId } = params;

  try {
    await connectToDatabase();

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({
        views: -1,
        upVotes: -1,
      })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return {
      totalQuestions,
      questions: userQuestions,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  const { userId } = params;

  try {
    await connectToDatabase();

    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upVotes: -1 })
      .populate("author", "_id clerkId name picture")
      .populate("question", "_id, title");

    return {
      totalAnswers,
      answers: userAnswers,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
