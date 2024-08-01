"use client";

import { FC, useEffect, useState } from "react";
import NewButton from "./NewButton";
import { useAuth } from "../auth/auth-provider";
import { getAllUserCases } from "./actions";
import UserCaseCard from "./UserCaseCard";
import New from "./New";

interface UserCasesListProps {}

const UserCasesList: FC<UserCasesListProps> = ({}) => {
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  const showEmptyState = cases.length === 0 && !isLoading;

  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        if (!auth?.currentUser) return;
        const fetchedCases = await getAllUserCases(auth.currentUser.uid);
        setCases(fetchedCases);
      } catch (e) {
        console.error("Failed to fetch cases:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, [auth?.currentUser]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full h-full">
        <div className="p-4 rounded-lg font-semibold min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4 rounded-lg font-semibold min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4 rounded-lg font-semibold min-h-[100px] animate-pulse bg-gray-200" />
        <div className="p-4 rounded-lg font-semibold min-h-[100px] animate-pulse bg-gray-200" />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full h-full">
        {cases.length > 0 && (
          <>
            <New />
            {cases.map((caseData) => (
              <UserCaseCard caseData={caseData} />
            ))}
          </>
        )}
      </div>
      {showEmptyState && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col items-center justify-center flex-grow">
            <img
              src="/images/empty_cases.png"
              alt="empty_state"
              className="w-[20%] h-auto"
            />
            <div className="opacity-60 text-center mt-4">
              <p>There're no cases for you to see yet.</p>
              <p>
                Start creating new cases, or you can browse the community cases.
              </p>
            </div>
            <div className="w-fit mt-6">
              <NewButton />
            </div>
            {/* <New /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default UserCasesList;
