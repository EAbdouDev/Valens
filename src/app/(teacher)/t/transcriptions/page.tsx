import TranscList from "@/components/teacher/transcriptions/TranscList";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full">
      <header className="mb-16 space-y-2">
        <h1 className="text-2xl font-semibold">Transcriptions</h1>
        <p className="font-light">
          Upload your lecture recording and let Gemini generate a full note for
          you.
        </p>
      </header>

      <TranscList />
    </div>
  );
};

export default page;
