import Sidebar from "@/components/navigation/Sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import { auth } from "../../../firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import SidebarWarpper from "@/components/navigation/SidebarWarpper";
import Navbar from "@/components/navigation/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const layout: FC<LayoutProps> = async ({ children }) => {
  // const cookieStore = cookies();
  // const authToken = cookieStore.get("firebaseIdToken")?.value;

  // if (!authToken || !auth) {
  //   redirect("/");
  // }

  // let user: DecodedIdToken | null = null;

  // try {
  //   user = await auth.verifyIdToken(authToken);
  // } catch (error) {
  //   redirect("/");
  // }

  // if (!user) {
  //   redirect("/");
  // }

  // let userInfo = null;
  // try {
  //   const userInfoResponse = await fetch(
  //     `${process.env.APP_URL}/api/users/${user.uid}`
  //   );

  //   if (userInfoResponse.ok) {
  //     userInfo = await userInfoResponse.json();
  //     console.log("User info fetched:", userInfo);
  //   } else {
  //     redirect("/");
  //   }
  // } catch (error) {
  //   redirect("/");
  // }

  // const isTeacher = userInfo?.isTeacher;

  // if (!isTeacher) {
  //   redirect("/");
  // }

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <div className="flex-1 flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="px-10 py-8 flex-1">{children}</main>
          {/* <footer className="p-4 border-t">Footer</footer> */}
        </div>

        <nav className="order-first  overflow-y-auto ">
          <Sidebar userRole="teacher" />
        </nav>
      </div>
    </div>
  );
};

export default layout;
