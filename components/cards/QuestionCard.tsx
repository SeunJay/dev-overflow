import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatBigNumber, getTimeStamp } from "@/lib/utils";
import EditDeleteAction from "../shared/EditDeleteAction";
import { SignedIn } from "@clerk/nextjs";

interface QuestionProps {
  id: number;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: number;
    name: string;
    picture: string;
    clerkId: string;
  };
  upVotes: Array<object>;
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string;
  tagRoutePrefix?: string;
}

const QuestionCard = ({
  id,
  title,
  tags,
  author,
  upVotes,
  views,
  answers,
  createdAt,
  clerkId,
  tagRoutePrefix,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <div className="card-wrapper rounded-[18px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {/* If signed in, add edit and delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag
            key={tag._id}
            id={tag._id}
            name={tag.name}
            tagRoutePrefix={tagRoutePrefix || "tags"}
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          href={`/profile/${author._id}`}
          isAuthor
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={formatBigNumber(upVotes.length)}
          title=" Votes"
          textStyles="small-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatBigNumber(answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light700"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatBigNumber(views)}
          title=" Views"
          textStyles="small-medium text-dark400_light700"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
