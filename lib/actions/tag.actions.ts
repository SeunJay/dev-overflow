"use server";

import Tag from "@/database/tag.model";
// import Tag from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";

export async function getAllTags(params: GetAllTagsParams) {
  const { page = 1, pageSize = 20, filter, searchQuery } = params;

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
