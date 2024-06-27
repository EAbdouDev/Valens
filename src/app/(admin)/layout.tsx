import Sidebar from "@/components/navigation/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { auth } from "../../../firebase/server";

import { DecodedIdToken } from "firebase-admin/auth";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("firebaseIdToken")?.value;
  let user: DecodedIdToken | null = null;

  if (!authToken || !auth || !user) {
    // redirect("/");
    console.log("erorrr");
  }

  try {
    user = await auth?.verifyIdToken(authToken);
  } catch (error) {
    console.log(error, "Admin Layout Error");
  }

  let userInfo = null;
  const userInfoResponse = await fetch(
    `${process.env.APP_URL}/api/users/${user?.uid}`
  );

  if (userInfoResponse.ok) {
    userInfo = await userInfoResponse.json();
  }

  const isAdmin = userInfo?.isAdmin;

  console.log(userInfo);

  //   if (!isAdmin) {
  //     // redirect("/");
  //     console.log("user Not Admin", userInfo);
  //   }
  return (
    <div className="min-h-screen flex flex-col h-screen">
      {/* <!-- main container --> */}
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col  overflow-y-auto ">
          <header className="border-b px-4 py-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </header>

          <main className="px-4 py-6 flex-1">{children}</main>
          <footer className="p-4 border-t">Footer</footer>
        </div>

        <nav className="order-first sm:w-64 overflow-y-auto border-r ">
          <Sidebar />
        </nav>
      </div>
      {/* <!-- end main container --> */}
    </div>
  );
};

export default layout;
