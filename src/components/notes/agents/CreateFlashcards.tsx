"use client";

import useNote from "@/zuztand/notesState";
import { Button } from "@nextui-org/react";
import { FC, useState } from "react";
import { generateFlashcards } from "./actions";

interface CreateFlashcardsProps {}

const CreateFlashcards: FC<CreateFlashcardsProps> = ({}) => {
  const { text } = useNote();
  const [flashcards, setFlashcards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createFlashcards = async () => {
    setIsLoading(true);
    const res = await generateFlashcards(text);

    if (res) {
      setFlashcards(res.flashcards);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="solid"
        color="primary"
        isLoading={isLoading}
        isDisabled={isLoading}
        onPress={createFlashcards}
      >
        Create
      </Button>

      <div className="space-y-4 mt-4 p-4">
        {flashcards &&
          flashcards.map((f: any, index: number) => (
            <div
              key={index}
              className="flex flex-col justify-start items-start gap-1 max-w-full "
            >
              <h1 className="font-semibold text-lg">{f.question}</h1>
              <p className="text-sm">{f.answer}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreateFlashcards;
