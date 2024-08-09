import { getFlashcardsDetails } from "@/components/flashcards/actions";
import CardsList from "@/components/flashcards/CardsList";
import FlashCardWithAnswer from "@/components/flashcards/FlashCardWithAnswer";
import { FC } from "react";

interface pageProps {
  params: {
    id: string;
  };
}

const FlashcardsPage: FC<pageProps> = async ({ params }) => {
  const cards = (await getFlashcardsDetails(params.id)) as any;
  return (
    <div className="w-full h-full p-10">
      <header className="max-w-3xl mx-auto mb-10">
        <h1 className="text-xl font-semibold">{cards?.title}</h1>
      </header>
      <CardsList cardsServer={cards?.flashcards} />

      {/* <div className="flex flex-col justify-start items-start gap-4 max-w-3xl mx-auto">
        {" "}
        {cards?.flashcards.map((flashcard: any, index: number) => (
          <FlashCardWithAnswer card={flashcard} index={index} />
        ))}
      </div> */}
    </div>
  );
};

export default FlashcardsPage;
