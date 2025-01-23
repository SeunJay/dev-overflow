"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.actions";
import { viewQuestion } from "@/lib/actions/interaction.actions";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.actions";
import { toggleSavedQuestion } from "@/lib/actions/user.actions";
import { formatBigNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface VotesProps {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasdownVoted,
  hasupVoted,
  hasSaved,
}: VotesProps) => {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : null,
    });
  }, [itemId, userId, router, pathName]);

  const handleSave = async () => {
    await toggleSavedQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathName,
    });
  };
  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathName,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathName,
        });
      }

      // todo: show a toast message
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          userId: JSON.parse(userId),
          questionId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathName,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          userId: JSON.parse(userId),
          answerId: JSON.parse(itemId),
          hasupVoted,
          hasdownVoted,
          path: pathName,
        });
      }

      // todo: show a toast message
    }
  };
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {upvotes ? formatBigNumber(upvotes) : 0}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {downvotes ? formatBigNumber(downvotes) : 0}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
