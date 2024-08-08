import { FC, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ThemeSwitcher from "@/components/navigation/ThemeSwitcher";
import { Button } from "@nextui-org/react";
import { useAuth } from "@/components/auth/auth-provider";
import { firestore } from "../../../../firebase/client";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { generateFeedback } from "../actions";

interface HeaderProps {
  caseTitle: string;
  elapsedTime: number;
  responses: { role: string; response: string }[];
  caseDetails: any;
}

const Header: FC<HeaderProps> = ({
  caseTitle,
  elapsedTime,
  responses,
  caseDetails,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSumbitCase = async () => {
    if (responses.length === 0) {
      return;
    }

    setIsLoading(true);

    const res = await generateFeedback(responses, caseDetails);

    if (res) {
      const answerData = {
        caseId: caseDetails.id,
        createdBy: auth?.currentUser!.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responses: JSON.stringify(responses),
        feedback: JSON.stringify(res),
      };

      const casesCollection = collection(firestore!, "cases_answer");
      const docRef = await addDoc(casesCollection, answerData);

      if (docRef.id) {
        router.push(`/v/cases/feedback/${docRef.id}`);
      }
    }
    setIsLoading(false);
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
        <ThemeSwitcher />{" "}
        <Button
          variant="bordered"
          onPress={handleSumbitCase}
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </div>
    </header>
  );
};

export default Header;
