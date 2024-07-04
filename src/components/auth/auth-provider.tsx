"use client";

import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../../../firebase/client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function getAuthToken(): string | undefined {
  return Cookies.get("firebaseIdToken");
}
export function setAuthToken(token: string): string | undefined {
  return Cookies.set("firebaseIdToken", token, { secure: true });
}
export function removeAuthToken(): void {
  return Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
  currentUser: User | null;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setIsStudent(false);
        setIsTeacher(false);
        removeAuthToken();
      }
      if (user) {
        const token = await user.getIdToken();
        setCurrentUser(user);
        setAuthToken(token);
        const tokenValues = await user.getIdTokenResult();

        if (tokenValues.claims.role === "admin") {
          setIsAdmin(true);
          // router.push("/a/dashboard");
        }

        const userResponse = await fetch(`/api/users/${user.uid}`);

        if (userResponse.ok) {
          const userJson = await userResponse.json();
          if (userJson?.isTeacher) {
            setIsTeacher(true);
            // router.push("/t/dashboard");
          }
          if (userJson?.isStudent) {
            setIsStudent(true);
            // router.push("/s/dashboard");
          }
        } else {
          console.error("could not get user info");
        }
      }
    });
  }, []);

  // useEffect(() => {
  //   if (isStudent) {
  //     router.push("/s/dashboard");
  //   }
  // }, [isStudent]);
  // useEffect(() => {
  //   if (isTeacher) {
  //     router.push("/t/dashboard");
  //   }
  // }, [isTeacher]);
  // useEffect(() => {
  //   if (isAdmin) {
  //     router.push("/a/dashboard");
  //   }
  // }, [isAdmin]);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      provider.addScope("openid");
      provider.addScope("https://www.googleapis.com/auth/calendar");
      provider.addScope("https://www.googleapis.com/auth/calendar.event");
      signInWithPopup(auth, provider)
        .then((user) => {
          console.log(`Signed in !: ${user.user.getIdToken(true)}`);

          resolve();
        })
        .catch(() => {
          console.log("Error");
          reject();
        });
    });
  }
  function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }

      auth
        .signOut()
        .then(() => {
          console.log("out");
          resolve();
        })
        .catch(() => {
          console.log("error");
          reject();
        });
    });
  }

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isStudent,
        isTeacher,
        currentUser,
        loginGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
