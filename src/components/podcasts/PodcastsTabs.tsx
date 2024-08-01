"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface PodcastsTabsProps {}

const PodcastsTabs: FC<PodcastsTabsProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div className="Tabs flex justify-start items-center gap-6 font-light transition-all ease-soft-spring">
      <Link
        href="/v/podcasts"
        className={`transition-all ease-soft-spring text-sm ${
          pathname === "/v/podcasts"
            ? "border-b-2 border-black dark:border-white opacity-100"
            : "opacity-70"
        }`}
      >
        My Podcasts
      </Link>
      <Link
        href="/v/podcasts/browse"
        className={`transition-all ease-soft-spring text-sm ${
          pathname === "/v/podcasts/browse"
            ? "border-b-2 border-black dark:border-white opacity-100"
            : "opacity-70"
        }`}
      >
        Browse Podcasts
      </Link>
    </div>
  );
};

export default PodcastsTabs;
