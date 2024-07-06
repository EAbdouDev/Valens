import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import { Sparkle, SparkleIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";

export function UserMessage({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return (
    <div className="group relative flex items-start  ">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center ",
          !auth?.currentUser?.photoURL &&
            "bg-black text-white dark:bg-white dark:text-black rounded-lg"
        )}
      >
        {auth?.currentUser?.photoURL && (
          <img
            src={auth?.currentUser?.photoURL || ""}
            alt="userPic"
            className="rounded-full"
          />
        )}

        {!auth?.currentUser?.photoURL && <UserIcon className="w-5 h-5" />}
      </div>

      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 pt-1  ">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex items-start ", className)}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border">
        <SparkleIcon />
      </div>

      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1  pt-1 ">
        {children}
      </div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className={cn("group relative flex items-start ")}>
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-lg border">
        <SparkleIcon />
      </div>

      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1   ">
        {children}
      </div>
    </div>
  );
}

export function AssistantMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-xs opacity-60">
      <div className="flex-initial p-2  pt-1 ">{children}</div>
    </div>
  );
}
