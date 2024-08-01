import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ThemeSwitcher from "@/components/navigation/ThemeSwitcher";

interface HeaderProps {
  caseTitle: string;
  elapsedTime: number;
}

const Header: FC<HeaderProps> = ({ caseTitle, elapsedTime }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center">
      <div className="flex justify-start items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href={"/v/cases"}>
                <ArrowLeft />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to cases, this would cancel this session.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <h1 className="text-xl font-semibold">{caseTitle}</h1>
      </div>

      <div className="text-lg font-medium flex justify-center items-center gap-6">
        {formatTime(elapsedTime)} <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
