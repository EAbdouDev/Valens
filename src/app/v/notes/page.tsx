import TextEditor from "@/components/editor/TextEditor";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

export default page;
