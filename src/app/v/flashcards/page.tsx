import FlashcardsList from "@/components/flashcards/FlashcardsList";
import { Metadata } from "next";
import { FC } from "react";

export const maxDuration = 60;
export const metadata: Metadata = {
  title: "Flashcards",
};

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="p-8 w-full  container">
      <FlashcardsList />
    </div>
  );
};

export default page;
