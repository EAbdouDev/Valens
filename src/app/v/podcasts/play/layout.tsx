import { FC, ReactNode, Suspense } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default layout;
