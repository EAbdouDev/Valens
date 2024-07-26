import { FC } from "react";
import NewButton from "./NewButton";

interface UserCasesListProps {}

const UserCasesList: FC<UserCasesListProps> = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center justify-center flex-grow">
        <img
          src="/images/empty_cases.png"
          alt="empty_state"
          className="w-[20%] h-auto"
        />
        <div className="opacity-60 text-center mt-4">
          <p>There're no cases for you to see yet.</p>
          <p>Start creating new case, or you can browse the community cases.</p>
        </div>
        <div className="w-fit mt-6">
          <NewButton />
        </div>
      </div>
    </div>
  );
};

export default UserCasesList;
