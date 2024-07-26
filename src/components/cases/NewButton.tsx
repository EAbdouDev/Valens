import { FC, useState } from "react";

import Link from "next/link";
import { Plus } from "lucide-react";

interface NewProps {}

const NewButton: FC<NewProps> = ({}) => {
  return (
    <Link
      href={"/v/cases/new/selector"}
      className=" cursor-pointer text-sm w-full shadow rounded-lg flex  justify-center items-center gap-2   font-semibold px-4 py-2 hover:bg-gray-100  transtion-all ease-soft-spring"
    >
      <Plus className="w-4 h-4" />
      New Case
    </Link>
  );
};

export default NewButton;
