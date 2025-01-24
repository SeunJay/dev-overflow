"use server";

import Tag, { ITag } from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";

export async function getAllTags(params: GetAllTagsParams) {
  const { searchQuery } = params;

  const query: FilterQuery<typeof Tag> = {};

  if (searchQuery) {
    query.$or = [
      {
        name: { $regex: new RegExp(searchQuery, "i") },
      },
      {
        description: { $regex: new RegExp(searchQuery, "i") },
      },
    ];
  }

  try {
    await connectToDatabase();
    const tags = await Tag.find(query).sort({ createdAt: -1 });

    return { tags };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractiveTags(
  params: GetTopInteractedTagsParams
) {
  const { userId } = params;
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interactions for the user and group by tags...
    // await Tag.find();
    return [
      {
        id: "1",
        name: "React",
      },
      {
        id: "2",
        name: "NextJS",
      },
    ];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  const { tagId, searchQuery } = params;

  try {
    await connectToDatabase();

    const query: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(query).populate({
      path: "questions",
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, "i") } }
        : {},
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

    if (!tag) {
      throw new Error("Tag not found!");
    }

    const questions = tag.questions as any[];

    return {
      tagTitle: tag.name as string,
      questions,
    };
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}
