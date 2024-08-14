import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
  {
    _id: 1,
    title: "How to use React Hooks?",
    tags: [
      { _id: "101", name: "React" },
      { _id: "102", name: "Hooks" },
    ],
    author: {
      _id: 201,
      name: "Jane Doe",
      picture: "https://example.com/jane.jpg",
    },
    upVotes: 15,
    views: 120,
    answers: [
      { text: "You can use the useState hook for state management." },
      { text: "The useEffect hook is great for side effects." },
    ],
    createdAt: new Date("2023-07-01T10:00:00Z"),
  },
  {
    _id: 2,
    title: "What is TypeScript?",
    tags: [
      { _id: "103", name: "TypeScript" },
      { _id: "104", name: "JavaScript" },
    ],
    author: {
      _id: 202,
      name: "John Smith",
      picture: "https://example.com/john.jpg",
    },
    upVotes: 30,
    views: 300,
    answers: [
      {
        text: "TypeScript is a superset of JavaScript that adds static types.",
      },
    ],
    createdAt: new Date("2023-08-05T12:30:00Z"),
  },
  {
    _id: 3,
    title: "How to manage state in a React application?",
    tags: [
      { _id: "105", name: "React" },
      { _id: "106", name: "State Management" },
    ],
    author: {
      _id: 203,
      name: "Alice Johnson",
      picture: "https://example.com/alice.jpg",
    },
    upVotes: 100000,
    views: 95,
    answers: [
      { text: "You can use the useState and useReducer hooks." },
      { text: "For complex state, consider using Redux or Context API." },
    ],
    createdAt: new Date("2022-06-20T09:15:00Z"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Link href={"/ask-question"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
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
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
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
}
