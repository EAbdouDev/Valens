"use client";
import { Disc2, Hospital, House, PanelLeftClose, Users } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  userRole: string;
}

const Sidebar: FC<SidebarProps> = ({ userRole }) => {
  const pathname = usePathname();
  const teacherLinks = [
    {
      name: "Dashboard",
      href: "/t/dashboard",
      active: pathname.includes("dashboard"),
      icon: <House className="w-5 h-5" />,
    },
    {
      name: "Cases",
      href: "/t/cases",
      active: pathname.includes("cases"),
      icon: <Hospital className="w-5 h-5" />,
    },
    {
      name: "Recordings",
      href: "/t/recordings",
      active: pathname.includes("recordings"),
      icon: <Disc2 className="w-5 h-5" />,
    },
    {
      name: "Groups",
      href: "/t/groups",
      active: pathname.includes("groups"),
      icon: <Users className="w-5 h-5" />,
    },
  ];
  const adminLinks = [
    {
      name: "Dashboard",
      href: "/a/dashboard",
      active: pathname.includes("dashboard"),
      icon: <House className="w-5 h-5" />,
    },
  ];
  const studentLinks = [
    {
      name: "Dashboard",
      href: "/s/dashboard",
      active: pathname.includes("dashboard"),
      icon: <House className="w-5 h-5" />,
    },
  ];

  let links;

  if (userRole === "teacher") {
    links = teacherLinks;
  }
  if (userRole === "admin") {
    links = adminLinks;
  }
  if (userRole === "studnet") {
    links = studentLinks;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center w-full px-4 py-6">
        <div className="flex flex-col justify-start items-start gap-2">
          <div className="flex justify-start items-center gap-2">
            <Image
              src={"/logo/logo_icon_dark_mode-01.svg"}
              alt="logo_dark_icon"
              width={30}
              height={30}
            />
            <h1 className="text-xl font-bold">Valnes </h1>
          </div>
        </div>
        <PanelLeftClose className="opacity-60 cursor-pointer hover:opacity-100 transition-all ease-in-out w-5 h-5" />
      </div>

      <div className="flex-grow my-4  px-2 py-4 w-full">
        <ul className="flex flex-col justify-start items-start gap-4 w-full">
          {links?.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className={`flex justify-start items-center gap-3 px-4 py-2  rounded-lg w-full font-medium ${
                link.active ? "bg-slate-100" : "hover:bg-slate-100"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </ul>
      </div>
      <div className=" border-t p-2">
        <UserMenu />
      </div>
    </div>
  );
};

export default Sidebar;
