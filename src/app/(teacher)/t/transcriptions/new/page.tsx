import NewTranscriptions from "@/components/teacher/transcriptions/NewTranscriptions";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-full pb-6">
      <header className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold">New Transcription</h1>
        <p className="font-light">
          Upload your lecture recording and let Gemini generate a full note for
          you.
        </p>
      </header>

      <NewTranscriptions />
    </div>
  );
};

export default page;
