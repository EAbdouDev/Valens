import TestEmb from "@/components/dashboard/TestEmb";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="  w-full h-full">
      <TestEmb />
    </div>
  );
};

export default page;
