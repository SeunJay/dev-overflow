import { getUserAnswers } from "@/lib/actions/user.actions";
import React from "react";
import AnswerCard from "../cards/AnswerCard";

interface Props {
  userId: string;
  clerkId: string;
  searchParams?: {
    [key: string]: string;
  };
}

const AnswerTab = async ({ userId, clerkId, searchParams }: Props) => {
  const response = await getUserAnswers({
    userId,
    page: 1,
  });

  return (
    <>
      {" "}
      {response.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upVotes={answer.upVotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswerTab;
