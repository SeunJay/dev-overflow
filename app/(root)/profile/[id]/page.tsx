import AnswerTab from "@/components/shared/AnswerTab";
import ProfileLink from "@/components/shared/ProfileLink";
import QuestionTab from "@/components/shared/QuestionTab";
import Stats from "@/components/shared/Stats";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserInfo } from "@/lib/actions/user.actions";
import { getMonthAndYear } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Params {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}

const Profile = async ({ params, searchParams }: Params) => {
  const { id } = await params;
  const queryParams = await searchParams;

  const { userId: clerkId } = await auth();

  if (!clerkId) return null;

  const response = await getUserInfo({
    userId: id,
  });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={response.user.picture}
            width={140}
            height={140}
            alt="user avatar"
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {response.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{response.user.username}
            </p>

            <div className="text-dark100_light900 mt-5 flex flex-wrap items-center justify-start gap-5">
              {response.user.portfolioWebsite && (
                <ProfileLink
                  title="Portfolio"
                  imgUrl="/assets/icons/link.svg"
                  href={response.user.portfolioWebsite}
                />
              )}
              {response.user.location && (
                <ProfileLink
                  title={response.user.location}
                  imgUrl="/assets/icons/location.svg"
                />
              )}

              <ProfileLink
                title={getMonthAndYear(response.user.joinAt)}
                imgUrl="/assets/icons/calendar.svg"
              />
            </div>

            {response.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                @{response.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3 ">
          <SignedIn>
            {clerkId === response.user.clerkId && (
              <Link href={"/profile/edit"}>
                <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={response.totalQuestions}
        totalAnswers={response.totalAnswers}
      />

      {/*  */}
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-questions" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="top-answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-questions"
            className="text-dark400_light900 mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              userId={response.user._id}
              clerkId={clerkId}
              searchParams={queryParams}
            />
          </TabsContent>
          <TabsContent
            value="top-answers"
            className="text-dark400_light900 mt-5 flex w-full flex-col gap-6"
          >
            <AnswerTab
              userId={response.user._id}
              clerkId={clerkId}
              searchParams={queryParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
