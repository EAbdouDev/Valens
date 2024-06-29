import { FC } from "react";

interface pageProps {
  params: {
    userId: string;
  };
}

const page: FC<pageProps> = ({ params }) => {
  return <div>{params.userId}</div>;
};

export default page;
