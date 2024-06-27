import Sidebar from "@/components/navigation/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { auth } from "../../../firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  //   const cookieStore = cookies();
  //   const authToken = cookieStore.get("firebaseIdToken")?.value;

  //   if (!authToken || !auth) {
  //     redirect("/");
  //   }

  //   let user: DecodedIdToken | null = null;

  //   try {
  //     user = await auth.verifyIdToken(authToken);
  //   } catch (error) {
  //     redirect("/");
  //   }

  //   if (!user) {
  //     redirect("/");
  //   }

  //   let userInfo = null;
  //   try {
  //     const userInfoResponse = await fetch(
  //       `${process.env.APP_URL}/api/users/${user.uid}`
  //     );

  //     if (userInfoResponse.ok) {
  //       userInfo = await userInfoResponse.json();
  //       console.log("User info fetched:", userInfo);
  //     } else {
  //       redirect("/");
  //     }
  //   } catch (error) {
  //     redirect("/");
  //   }

  //   const isStudent = userInfo?.isStudent;

  //   if (!isStudent) {
  //     redirect("/");
  //   }

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="border-b px-4 py-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </header>

          <main className="px-4 py-6 flex-1">{children}</main>
          <footer className="p-4 border-t">Footer</footer>
        </div>

        <nav className="order-first sm:w-64 overflow-y-auto border-r">
          <Sidebar userRole="studnet" />
        </nav>
      </div>
    </div>
  );
};

export default layout;
