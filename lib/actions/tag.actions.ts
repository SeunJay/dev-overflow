"use server";

// import Tag from "@/database/tag.model";
import { connectToDatabase } from "./mongoose";
import { GetTopInteractedTagsParams } from "./shared.types";
import User from "@/database/user.model";

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
