import MindmapsTabs from "@/components/mindmaps/MindmapsTabs";
import { Metadata } from "next";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "MindMaps",

  description: "An assistant to help medical studnets.",
};

const MindMapsPage: FC<pageProps> = ({}) => {
  return (
    <div className="w-full p-8">
      <MindmapsTabs />
      <header className="space-y-2 my-10">
        <h1 className="text-2xl font-bold">My MindMaps</h1>
      </header>

      {/* <Link href={`/v/cases/new/selector`}>New Case</Link> */}
    </div>
  );
};

export default MindMapsPage;
