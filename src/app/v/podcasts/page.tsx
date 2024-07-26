import { Metadata } from "next";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

export const metadata: Metadata = {
  title: "Podcasts",

  description: "An assistant to help medical studnets.",
};

const PodcastsPage: FC<pageProps> = ({}) => {
  return (
    <div className="w-full p-8">
      <Link href={"/v/podcasts/new"}>New Podcast</Link>
    </div>
  );
};

export default PodcastsPage;
