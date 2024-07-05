import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full">
      <header className="mb-16 space-y-2">
        <h1 className="text-2xl font-semibold">New Case</h1>
        <p className="font-light">
          Just enter the disease name and let Gemini create a full case for you,
          you can customize it further.
        </p>
      </header>
    </div>
  );
};

export default page;
