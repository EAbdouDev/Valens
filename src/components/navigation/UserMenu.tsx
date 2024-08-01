import { FC } from "react";
import { useAuth } from "../auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { UserIcon } from "@hugeicons/react-pro";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {}

const UserMenu: FC<UserMenuProps> = ({}) => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <>
      {!auth?.currentUser && (
        <div className="min-w-10 min-h-10 animate-pulse bg-gray-500 rounded-full border" />
      )}
      {auth?.currentUser && (
        <Popover>
          <PopoverTrigger className="  hover:bg-slate-100 rounded-full transition-all ease-in-out border shadow bg-white">
            <Avatar className="w-8 h-8 flex-none">
              <AvatarImage
                src={auth?.currentUser?.photoURL || ""}
                alt="userPicture "
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {/* <div className="space-y-1 max-w-full truncate">
          <h1 className="text-sm font-medium  max-w-full truncate">
            {auth?.currentUser?.displayName}
          </h1>
          <p className="text-xs opacity-70  max-w-full truncate">
            {auth?.currentUser?.email}
          </p>
        </div> */}
          </PopoverTrigger>
          <PopoverContent
            align="center"
            alignOffset={60}
            className="  mr-6 p-4 max-w-[250px] bg-transparent backdrop-blur-3xl"
          >
            <ul className="w-full">
              <div className="flex justify-start items-start gap-4 mb-4 border-b pb-2">
                <div>
                  <img
                    src={auth?.currentUser?.photoURL || ""}
                    alt="userPicture "
                    className="w-8 h-8  rounded-full border shadow bg-white"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                </div>
                <div>
                  {" "}
                  <h1 className="text-sm font-medium  max-w-full truncate">
                    {auth?.currentUser?.displayName}
                  </h1>
                  <p className="text-xs opacity-70  max-w-full truncate">
                    {auth?.currentUser?.email}
                  </p>
                </div>
              </div>
              {/* <li className="w-full">
                <Link
                  href={"#"}
                  className="flex justify-start items-center gap-3 w-full px-4 py-2 hover:bg-slate-100 rounded-lg "
                >
                  <User className="opacity-70 w-5 h-5" />
                  Profile
                </Link>
              </li> */}

              <li>
                <button
                  onClick={() => {
                    auth?.logout();
                    router.push("/");
                  }}
                  className="text-sm flex justify-start items-center gap-3 w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-muted rounded-lg "
                >
                  <LogOut className="opacity-70 w-4 h-4" /> Sign out
                </button>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default UserMenu;
