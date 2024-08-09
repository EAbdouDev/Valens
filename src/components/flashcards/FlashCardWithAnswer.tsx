"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Edit, FileText, Flag, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar } from "@nextui-org/react";

interface FlashCardWithAnswerProps {
  card: any;

  flipCard?: any;

  index?: any;
}

const FlashCardWithAnswer: FC<FlashCardWithAnswerProps> = ({
  card,

  index,

  flipCard,
}) => {
  const router = useRouter();

  const handleDeleteCard = async () => {
    toast.success("Flashcard deleted successfully!");
    router.refresh();
  };

  return (
    <div className="flex flex-col justify-start items-start  min-w-full w-full border rounded-lg bg-card/50">
      <div className="Header border-b p-4 flex justify-between items-center cursor-default w-full">
        <div className="flex justify-start items-center gap-4">
          <h2 className="font-semibold opacity-50">#{index + 1}-Question</h2>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="flex justify-center items-center gap-4 ">
            <AlertDialog>
              <AlertDialogTrigger className="flex justify-center items-center gap-2 p-2 border-2 rounded-lg border-red-500 text-red-500 opacity-90 hover:opacity-100 transition-all ease-soft-spring">
                <Trash2 className="w-4 h-4" /> Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this card.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className=" bg-red-500 hover:bg-red-600"
                    onClick={handleDeleteCard}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link
              href={`#`}
              className="opacity-90 hover:opacity-100 transition-all ease-soft-spring flex justify-center items-center gap-2 p-2 backdrop-blur-2xl border-2 rounded-lg"
            >
              <Edit className="w-4 h-4" /> Edit
            </Link>
          </div>
        </div>
      </div>
      <div className=" flex flex-col lg:flex-row justify-start items-start lg:items-center   w-full  ">
        <div className="Qs sm:border-b w-full lg:border-r lg:min-w-[50%] lg:max-w-[50%]">
          <p>{card.question}</p>
        </div>
        <div className="asnwer w-full lg:min-w-[50%] lg:max-w-[50%]">
          <p>{card.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashCardWithAnswer;
