"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

interface TranscListProps {}

const TranscList: FC<TranscListProps> = ({}) => {
  const [transcriptions, setTranscriptions] = useState([]);
  return (
    <div className="w-full h-full">
      <h1 className="text-lg font-semibold opacity-80">My transcriptions</h1>
      {/* {isLoading && (
    <div className="flex flex-col justify-center items-center flex-grow w-full h-full">
      <Loader2 className="animate-spin" />
    </div>
  )} */}
      {transcriptions.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-grow w-full h-full mt-20 space-y-4">
          <h1 className="text-xl font-medium ">
            You don't have any transcriptions yet
          </h1>
          <p className="opacity-90 mb-4">
            Start creating your first transcription
          </p>
          <Link
            href={"/t/transcriptions/new"}
            className=" flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-black text-white"
          >
            {" "}
            <Plus /> Create new transcription
          </Link>

          <Link
            href={"/guides/transcription"}
            className="text-sm underline text-blue-600 pt-4"
          >
            Learn more about transcriptions
          </Link>
        </div>
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 w-full h-full mt-4">
          {transcriptions.length !== 0 && (
            <Link
              href={"/t/transcriptions/new"}
              className="flex flex-col justify-center items-center border-2 border-dashed gap-4 rounded-lg hover:bg-slate-100 transition-all ease-in-out"
            >
              <Plus /> <p className="text-lg font-medium">New Case</p>
            </Link>
          )}
          {transcriptions.map((transcription) => (
            <p>case</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranscList;
