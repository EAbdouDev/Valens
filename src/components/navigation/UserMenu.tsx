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
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserMenuProps {}

const UserMenu: FC<UserMenuProps> = ({}) => {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger className="w-full flex justify-start items-center gap-4 text-left hover:bg-slate-100 px-2 py-2 rounded-lg transition-all ease-in-out">
        <Avatar>
          <AvatarImage
            src={auth?.currentUser?.photoURL || ""}
            alt="userPicture"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="space-y-1 max-w-full truncate">
          <h1 className="text-sm font-medium  max-w-full truncate">
            {auth?.currentUser?.displayName}
          </h1>
          <p className="text-xs opacity-70  max-w-full truncate">
            {auth?.currentUser?.email}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={30} className=" ml-6 p-2">
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
            >
              Signout
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
