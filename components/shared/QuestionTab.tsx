import { getUserQuestions } from "@/lib/actions/user.actions";
import React from "react";
import QuestionCard from "../cards/QuestionCard";

interface Props {
  userId: string;
  clerkId: string;
  searchParams?: {
    [key: string]: string;
  };
}

const QuestionTab = async ({ userId, clerkId, searchParams }: Props) => {
  const response = await getUserQuestions({
    userId,
    page: 1,
  });

  return (
    <>
      {response.questions.map((question) => (
        <QuestionCard
          key={question._id}
          id={question._id}
          title={question.title}
          author={question.author}
          tags={question.tags}
          upVotes={question.upVotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
          clerkId={clerkId}
          tagRoutePrefix="tags"
        />
      ))}
    </>
  );
};

export default QuestionTab;
