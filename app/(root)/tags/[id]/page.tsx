import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { getQuestionsByTagId } from "@/lib/actions/tag.actions";
import React from "react";

interface Params {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const TagDetails = async ({ params, searchParams }: Params) => {
  const { id } = await params;
  const { query } = await searchParams;

  const response = await getQuestionsByTagId({
    tagId: id,
    page: 1,
    searchQuery: query,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{response.tagTitle}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route={`/tags/${id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {response.questions.length > 0 ? (
          response.questions.map((question) => (
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
              tagRoutePrefix=""
            />
          ))
        ) : (
          <NoResult
            title="There's no tag question to show"
            description="Be the first to break the silence! Ask a question and kickstart the
    discussion. Our query could be the next big thing others learn from. Get
    involved!"
            link="/"
            linkTitle="Ask a question"
          />
        )}
      </div>
    </>
  );
};

export default TagDetails;
