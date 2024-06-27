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
        setIsAdmin(tokenValues.claims.role === "admin");

        const userResponse = await fetch(`/api/users/${user.uid}`);

        if (userResponse.ok) {
          const userJson = await userResponse.json();
          if (userJson?.isTeacher) setIsTeacher(true);
          if (userJson?.isStudent) setIsStudent(true);
        } else {
          console.error("could not get user info");
        }
      }
    });
  }, []);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }
      signInWithPopup(auth, new GoogleAuthProvider())
        .then((user) => {
          console.log("Signed in !");

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
