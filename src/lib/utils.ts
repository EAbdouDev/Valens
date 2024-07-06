import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const parseRelativeDate = (relativeDay: string): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of the day in local time

  switch (relativeDay.toLowerCase()) {
    case "today":
      return today;
    case "tomorrow":
      return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    case "yesterday":
      return new Date(today.getTime() - 24 * 60 * 60 * 1000);
    default:
      // If not a relative date, try to parse it as a standard date in local time
      const [month, day, year] = relativeDay.split("/");
      if (!month || !day || !year) {
        throw new Error("Invalid date format");
      }
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      return parsedDate;
  }
};
