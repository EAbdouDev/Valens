import PodcastsTabs from "@/components/podcasts/PodcastsTabs";
import { UserPodcastsList } from "@/components/podcasts/UserPodcastsList";
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
    <div className="p-8 w-full h-full container">
      <PodcastsTabs />
      <header className="space-y-2 my-10">
        <h1 className="text-2xl font-bold">My Podcasts</h1>
      </header>
      <UserPodcastsList />
    </div>
  );
};

export default PodcastsPage;
