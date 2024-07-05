import { FC } from "react";

interface pageProps {}

const AuthPage: FC<pageProps> = ({}) => {
  return (
    <div>
      Auth Page, Hello Users <h1 className="text-2xl font-semibold">Heyyy</h1>
    </div>
  );
};

export default AuthPage;
