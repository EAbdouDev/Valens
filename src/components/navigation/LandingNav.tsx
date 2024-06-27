"use client";

import { FC } from "react";
import { useAuth } from "../auth/auth-provider";
import Link from "next/link";
import Image from "next/image";

interface LandingNavProps {}

const LandingNav: FC<LandingNavProps> = ({}) => {
  const auth = useAuth();

  const loginGoogle = () => {
    auth
      ?.loginGoogle()
      .then(() => console.log("logged in!"))
      .catch((error) => {
        console.log("Error login with google, landingNav", error);
      });
  };
  const logout = () => {
    auth
      ?.logout()
      .then(() => console.log("logged out!"))
      .catch(() => {
        console.log("Error logout, landingNav");
      });
  };
  return (
    <div className="flex justify-between items-center w-full px-6 py-4 border-b">
      <div className="Branding flex justify-start items-center gap-2">
        <Image
          src={"/logo/logo_icon_dark_mode-01.svg"}
          alt="logo_dark_icon"
          width={35}
          height={35}
        />
        <h1 className="text-xl font-bold">Valens AI</h1>
      </div>
      {!auth?.currentUser && (
        <button onClick={loginGoogle}>Sign in with Google</button>
      )}
      {auth?.currentUser && (
        <Link href={`/t/dashboard`} className="border px-4 py-2 rounded-lg">
          Dashboard
        </Link>
      )}
    </div>
  );
};

export default LandingNav;
