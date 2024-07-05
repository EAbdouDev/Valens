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
export function setAuthToken(token: string): void {
  Cookies.set("firebaseIdToken", token, { secure: true });
}
export function removeAuthToken(): void {
  Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
  currentUser: User | null;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setCurrentUser(null);

        removeAuthToken();

        return;
      }

      const token = await user.getIdToken();
      setCurrentUser(user);
      setAuthToken(token);
    });
  }, []);

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
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          const token = await user.getIdToken();
          setAuthToken(token);

          resolve();
        })
        .catch((error) => {
          console.log("Error", error);
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
          removeAuthToken();

          resolve();
        })
        .catch((error) => {
          console.log("error", error);
          reject();
        });
    });
  }

  return (
    <AuthContext.Provider
      value={{
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
