"use client";

import { FC, useEffect, useState } from "react";
import NewButton from "./NewButton";
import { useAuth } from "../auth/auth-provider";
import { getAllUserCases } from "./actions";
import UserCaseCard from "./UserCaseCard";
import New from "./New";
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

interface UserCasesListProps {}

const UserCasesList: FC<UserCasesListProps> = ({}) => {
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredCases = cases.filter((caseDetails) =>
    caseDetails.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <header className=" mb-8 flex justify-between items-center gap-x-4 ">
        <h1 className="text-2xl 2xl:text-3xl font-bold">My Cases</h1>
        <Input
          placeholder="Search..."
          startContent={<Search className="w-4 h-5 opacity-70" />}
          className="max-w-[30%]  "
          variant="bordered"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full h-full">
        {filteredCases.length > 0 && (
          <>
            <New />
            {filteredCases.map((caseData) => (
              <UserCaseCard caseDetails={caseData} />
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
            <div className="opacity-60 text-center">
              {searchQuery ? (
                <p>No cases match your search criteria.</p>
              ) : (
                <>
                  <p>There're no cases for you to see yet.</p>
                  <p>Start creating your first case.</p>
                </>
              )}
            </div>
            {!searchQuery && (
              <div className="w-fit mt-6">
                <NewButton />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserCasesList;
