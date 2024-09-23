import React from "react";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}

const AllAnswers = ({ questionId, userId, totalAnswers }: Props) => {
  return <div className="mt-11">AllAnswers</div>;
};

export default AllAnswers;
