"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface CasesTabsProps {}

const CasesTabs: FC<CasesTabsProps> = ({}) => {
  const pathname = usePathname();

  return (
    <div className="Tabs flex justify-start items-center gap-6 font-light transition-all ease-soft-spring">
      <Link
        href="/v/cases"
        className={`transition-all ease-soft-spring text-sm ${
          pathname === "/v/cases"
            ? "border-b-2 border-black dark:border-white opacity-100"
            : "opacity-70"
        }`}
      >
        My Cases
      </Link>
      <Link
        href="/v/cases/browse"
        className={`transition-all ease-soft-spring text-sm ${
          pathname === "/v/cases/browse"
            ? "border-b-2 border-black dark:border-white opacity-100"
            : "opacity-70"
        }`}
      >
        Browse Cases
      </Link>
    </div>
  );
};

export default CasesTabs;
