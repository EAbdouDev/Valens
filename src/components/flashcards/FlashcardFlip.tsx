"use client";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactCardFlip from "react-card-flip";

interface FlashcardFlipProps {
  card?: any;
  index?: any;
}

const FlashcardFlip: FC<FlashcardFlipProps> = ({ card, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        console.log("Enter key pressed");
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped}>
      <div
        className="Qs flex justify-center items-center h-full w-full p-6 rounded-lg "
        onClick={flipCard}
      >
        <p>{card.question}</p>
      </div>

      <div
        className="Answer flex justify-center items-center h-full w-full p-6  rounded-lg"
        onClick={flipCard}
      >
        <p>{card.answer}</p>
      </div>
    </ReactCardFlip>
  );
};

export default FlashcardFlip;
