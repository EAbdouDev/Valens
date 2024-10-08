import React from "react";

type UserMessageProps = {
  message: string;
  chatId?: string;
  showShare?: boolean;
};

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  chatId,
  showShare = false,
}) => {
  const enableShare = process.env.ENABLE_SHARE === "true";
  return (
    <div className="flex items-center w-full space-x-1    ">
      <div className="text-base flex-1 break-words w-full">{message}</div>
    </div>
  );
};
