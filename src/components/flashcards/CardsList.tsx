"use client";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { type CarouselApi } from "@/components/ui/carousel";
import FlashcardFlip from "./FlashcardFlip";

interface CardsListProps {
  cardsServer: any;
}

const CardsList: FC<CardsListProps> = ({ cardsServer }) => {
  const [cards, setCards] = useState<any>(cardsServer);
  const [imageSrc, setImageSrc] = useState("");
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    setCards(cardsServer);
  }, [cardsServer]);

  //   if (isLoading || isRefetching || !cards)
  //     return (
  //       <div className="flex flex-col justify-center items-center flex-grow w-full h-full gap-4">
  //         <Loader2 className="animate-spin w-5 h-5" />
  //         <p>Loading flascards...</p>
  //       </div>
  //     );

  //   if (cards.length === 0) {
  //     return (
  //       <div className="flex flex-col justify-center items-center gap-4 flex-grow w-full h-full">
  //         <h1 className="text-lg font-medium">No flashcards yet. </h1>
  //       </div>
  //     );
  //   }

  return (
    <div className=" max-w-full xl:max-w-3xl mx-auto space-y-16  w-full h-full">
      {cards.length === 0 && <div>No Cards</div>}
      <Carousel
        className=" shadow-lg rounded-lg dark:border cursor-pointer"
        setApi={setApi}
      >
        <CarouselContent>
          {cards.map((card: any, index: number) => (
            <CarouselItem key={card.id}>
              <FlashcardFlip card={card} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CardsList;
