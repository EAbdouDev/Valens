import Link from "next/link";
import { FC } from "react";

interface NewProps {}

const New: FC<NewProps> = ({}) => {
  return (
    <Link
      href="/v/cases/new/custom-case"
      className=" cursor-pointer w-full border-2 border-dashed rounded-2xl flex flex-col justify-center items-center gap-2  text-xl font-semibold p-4 hover:bg-gray-100 dark:hover:bg-muted  hover:border-divider transtion-all ease-soft-spring"
    >
      New
    </Link>
  );
};

export default New;
