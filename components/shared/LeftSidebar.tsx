"use client";

import { sidebarLinks } from "@/constants";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const { userId } = useAuth();
  const pathName = usePathname();

  return (
    <section className="background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathName.includes(item.route) && item.route.length > 1) ||
            pathName === item.route;

          if (item.route === "/profile") {
            if (userId) {
              item.route = `${item.route}/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <Link
              key={item.label}
              href={item.route}
              className={`${isActive ? "primary-gradient rounded-lg text-light-900" : "text-dark300_light900"} flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p
                className={`${isActive ? "base-bold" : "base-medium"} text-black dark:text-white max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href={"/sign-in"}>
            <Button className="small-medium btn-secondary mt-3 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={"/assets/icons/account.svg"}
                alt="login"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient hidden lg:block">
                Log In
              </span>
            </Button>
          </Link>

          <Link href={"/sign-up"}>
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 mt-3 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <Image
                src={"/assets/icons/sign-up.svg"}
                alt="sign up"
                width={20}
                height={20}
                className="invert-colors lg:hidden"
              />
              <span className="primary-text-gradient hidden lg:block">
                Sign Up
              </span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
