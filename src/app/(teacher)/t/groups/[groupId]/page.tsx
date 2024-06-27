import { FC } from "react";

interface pageProps {
  params: {
    groupId: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  return <div>{params.groupId}</div>;
};

export default page;
