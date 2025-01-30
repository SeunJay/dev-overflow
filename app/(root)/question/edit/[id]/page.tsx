import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface Params {
  params: Promise<{ [key: string]: string }>;
}

const EditQuestion = async ({ params }: Params) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  const question = await getQuestionById({
    questionId: id,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(mongoUser?._id)}
          type="Edit"
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
};

export default EditQuestion;
