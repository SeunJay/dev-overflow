import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatBigNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const QuestionDetails = async ({ params }: any) => {
  const { userId: clerKId } = auth();
  const question = await getQuestionById({
    questionId: params.id,
  });

  let mongoUser;

  if (clerKId) {
    mongoUser = await getUserById({ userId: clerKId });
  }

  return (
    <>
      <div className="flex-start flex w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center gap-1"
          >
            <Image
              src={question.author.picture}
              width={22}
              height={22}
              alt="profile avatar"
              className="rounded-full"
            />

            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>

          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={question.upvotes?.length}
              downvotes={question.downvotes?.length}
              hasupVoted={question.upvotes?.includes(mongoUser?._id)}
              hasdownVoted={question.downvotes?.includes(mongoUser?._id)}
              hasSaved={mongoUser?.saved.includes(question._id)}
            />
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(question.createdAt)}`}
          title=" Asked"
          textStyles="small-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatBigNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatBigNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light700"
        />
      </div>

      <div className="w-full">
        <ParseHTML data={question.content} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={question._id}
        userId={JSON.stringify(mongoUser?._id)}
        totalAnswers={question.answers.length}
      />

      <Answer
        question={question.content}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(mongoUser?._id)}
      />
    </>
  );
};

export default QuestionDetails;
