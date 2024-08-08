"use client";

import useNote from "@/zuztand/notesState";
import { Button } from "@nextui-org/react";
import { FC, useEffect, useState } from "react";
import {
  generateFlashcards,
  getNoteFlashcards,
  saveFlashcards,
} from "./actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2 } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardGroup {
  name: string;
  flashcards: Flashcard[];
}

interface CreateFlashcardsProps {
  noteSlug: string;
}

const CreateFlashcards: FC<CreateFlashcardsProps> = ({ noteSlug }) => {
  const { text } = useNote();
  const auth = useAuth();
  const userId = auth?.currentUser?.uid!;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [groups, setGroups] = useState<FlashcardGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  useEffect(() => {
    getFlashcards();
  }, [noteSlug]);

  const getFlashcards = async () => {
    setIsFetching(true);
    const res = await getNoteFlashcards(noteSlug, userId);
    console.log(res);

    if (res) {
      const newGroups = res.map((result: any) => {
        const { title, flashcards } = result;
        return { name: title, flashcards };
      });

      setGroups([...newGroups]);
      setIsFetching(false);
    }
  };

  const createFlashcards = async () => {
    setIsLoading(true);
    const res = await generateFlashcards(text);

    if (res) {
      const { title, flashcards } = res;
      await saveFlashcards(flashcards, noteSlug, userId, title);
      setGroups([...groups, { name: title, flashcards }]);

      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-20">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (groups.length === 0 && !isLoading && !isFetching) {
    return (
      <div className="w-full flex flex-col justify-center items-center gap-4 mt-20">
        <h1>No flashcards yet.</h1>
        <Button
          variant="solid"
          color="primary"
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={createFlashcards}
        >
          Create
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full  p-2">
        <div className="space-y-4 ">
          {groups.map((group, index) => (
            <div
              key={index}
              className="bg-[#bfbfbf] dark:bg-[#2a2a2a] pb-3 rounded-lg"
            >
              <div className="bg-[#d0d0d0] dark:bg-[#353535]  pb-3 rounded-lg">
                <div className="flex flex-col justify-start items-start gap-2 p-2  rounded-md bg-white dark:bg-background border">
                  <h3 className=" font-medium">
                    {group.name} #{index + 1}
                  </h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setSelectedGroup(index)}
                        variant="bordered"
                      >
                        View Flashcards
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90%] lg:min-w-[50%] overflow-y-auto">
                      <DialogHeader className="mb-2">
                        <DialogTitle className="text-2xl">
                          {groups[selectedGroup!]?.name} #{index + 1}
                        </DialogTitle>
                      </DialogHeader>

                      <div>
                        <p>
                          {groups[selectedGroup!]?.flashcards.length} Flashcards
                        </p>
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        {groups[selectedGroup!]?.flashcards.map(
                          (f: Flashcard, i: number) => (
                            <div
                              key={i}
                              className="flex flex-col justify-start items-start gap-1 w-full border p-2 rounded-md"
                            >
                              <h1 className="font-semibold text-lg">
                                {f.question}
                              </h1>
                              <p className="text-sm">{f.answer}</p>
                            </div>
                          )
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end items-end">
        <Button
          variant="solid"
          color="primary"
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={createFlashcards}
        >
          {groups.length > 0 ? "Create more" : "Create"}
        </Button>
      </div>
    </div>
  );
};

export default CreateFlashcards;
