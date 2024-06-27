"use client";

import { FC } from "react";
import { useAuth } from "../auth/auth-provider";

interface LandingNavProps {}

const LandingNav: FC<LandingNavProps> = ({}) => {
  const auth = useAuth();

  const loginGoogle = () => {
    auth
      ?.loginGoogle()
      .then(() => console.log("logged in!"))
      .catch(() => {
        console.log("Error login with google, landingNav");
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
    <div>
      {!auth?.currentUser && (
        <button onClick={loginGoogle}>Sign in with Google</button>
      )}
      {auth?.currentUser && <button onClick={logout}>Logout</button>}
      {auth?.currentUser && (
        <div>
          <p>{auth.currentUser.displayName}</p>
          <p>{auth.currentUser.email}</p>
        </div>
      )}

      {auth?.currentUser &&
        !auth.isAdmin &&
        !auth.isTeacher &&
        auth.isStudent && <p>Student User</p>}
      {auth?.currentUser && auth.isAdmin && <p>Admin User</p>}
      {auth?.currentUser &&
        !auth.isAdmin &&
        auth.isTeacher &&
        !auth.isStudent && <p>Teacher User</p>}
    </div>
  );
};

export default LandingNav;
