"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the auth state has been resolved
    if (auth?.currentUser !== undefined) {
      setLoading(false);
      if (auth.currentUser) {
        router.push("/v/notes");
      }
    }
  }, [auth?.currentUser, router]);

  const loginGoogle = () => {
    auth
      ?.loginGoogle()
      .then(() => router.push("/v/notes"))
      .catch((error) => {
        console.log("Error login with google, landingNav", error);
      });
  };

  if (loading) {
    return (
      <section className="flex flex-col justify-center items-center flex-grow w-full h-screen ">
        <div>Loading...</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center flex-grow w-full h-screen ">
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
          href={`/v/notes`}
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
    </section>
  );
}
