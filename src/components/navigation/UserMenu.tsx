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
          <PopoverTrigger className="  hover:bg-slate-100 rounded-full transition-all ease-in-out border shadow">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={auth?.currentUser?.photoURL || ""}
                alt="userPicture"
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
          <PopoverContent align="center" alignOffset={30} className=" mr-6 p-2">
            <ul className="w-full">
              <li className="w-full">
                <Link
                  href={"#"}
                  className="flex justify-start items-center gap-3 w-full px-4 py-2 hover:bg-slate-100 rounded-lg "
                >
                  <User className="opacity-70 w-5 h-5" />
                  Profile
                </Link>
              </li>

              <li>
                <button
                  onClick={() => {
                    auth?.logout();
                    router.push("/");
                  }}
                  className="flex justify-start items-center gap-3 w-full px-4 py-2 hover:bg-slate-100 rounded-lg "
                >
                  <LogOut className="opacity-70 w-5 h-5" /> Sign out
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
