"use client";

import { FC } from "react";
import { useAuth } from "../auth/auth-provider";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <button
          onClick={loginGoogle}
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          Sign in with Google
        </button>
      )}
      {auth?.currentUser && (
        <Link
          href={`/t/dashboard`}
          className=" px-4 py-2 rounded-lg bg-black text-white flex justify-start items-center gap-2"
        >
          {/* <Avatar>
            <AvatarImage
              src={auth?.currentUser?.photoURL || ""}
              alt="userPicture"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>{" "} */}
          Continue to Dashboard as {auth?.currentUser.displayName}
        </Link>
      )}
    </div>
  );
};

export default LandingNav;
