import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (date: Date): string => {
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} ${secondsAgo > 1 ? "seconds" : "second"}  ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo > 1 ? "minutes" : "minute"}  ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo > 1 ? "hours" : "hour"} ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo} ${daysAgo > 1 ? "days" : "day"}  ago`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} ${monthsAgo > 1 ? "months" : "month"} ago`;
  }

  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo} ${yearsAgo > 1 ? "years" : "year"} ago`;
};

export const formatBigNumber = (num: number): string => {
  if (num >= 1_000_000) {
    const formattedNum = num / 1_000_000;
    return `${formattedNum}M`;
  } else if (num >= 1_000) {
    const formattedNum = num / 1_000;
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};
