import { formatBigNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  totalQuestions: number;
  totalAnswers: number;
}

interface StatCardProps {
  title: string;
  imgUrl: string;
  value: number;
}

const StatCard = ({ imgUrl, value, title }: StatCardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200">
      <Image src={imgUrl} alt="badge icon" width={40} height={50} />
      <div className="">
        <p className="paragraph-semibold text-dark200_light900">
          {formatBigNumber(value)}
        </p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ totalQuestions, totalAnswers }: Props) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">Stats</h4>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-light-200">
          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div className="">
            <p className="paragraph-semibold text-dark200_light900">
              {formatBigNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        {/*  */}
        <StatCard
          title="Gold Badges"
          imgUrl="/assets/icons/gold-medal.svg"
          value={0}
        />

        <StatCard
          title="Silver Badges"
          imgUrl="/assets/icons/silver-medal.svg"
          value={0}
        />

        <StatCard
          title="Bronze Badges"
          imgUrl="/assets/icons/bronze-medal.svg"
          value={0}
        />
      </div>
    </div>
  );
};

export default Stats;
