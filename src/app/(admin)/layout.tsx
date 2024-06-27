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
  const cookieStore = cookies();
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken || !auth) {
    console.error("No auth token or auth instance found.");
    redirect("/");
    return null; // Prevent further code execution
  }

  let user: DecodedIdToken | null = null;

  try {
    user = await auth.verifyIdToken(authToken);
    console.log("Verified ID token:", user);
  } catch (error) {
    console.error("Error verifying ID token:", error);
    redirect("/");
    return null; // Prevent further code execution
  }

  if (!user) {
    console.error("User not found after verifying ID token.");
    redirect("/");
    return null; // Prevent further code execution
  }

  let userInfo = null;
  try {
    const userInfoResponse = await fetch(
      `${process.env.APP_URL}/api/users/${user.uid}`
    );

    if (userInfoResponse.ok) {
      userInfo = await userInfoResponse.json();
      console.log("User info fetched:", userInfo);
    } else {
      console.error(
        "Failed to fetch user info:",
        await userInfoResponse.text()
      );
      redirect("/");
      return null; // Prevent further code execution
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    redirect("/");
    return null; // Prevent further code execution
  }

  const isAdmin = userInfo?.isAdmin;

  if (!isAdmin) {
    console.log("User is not an admin:", userInfo);
    redirect("/");
    return null; // Prevent further code execution
  }

  console.log("User is a student, rendering layout.");

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
          <Sidebar />
        </nav>
      </div>
    </div>
  );
};

export default layout;
