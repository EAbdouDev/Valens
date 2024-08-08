import {
  generateFeedback,
  getCaseAnswer,
  getCaseDetails,
} from "@/components/cases/actions";
import Feedback from "@/components/cases/Feedback";
import { FC } from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const FeedbackPage: FC<PageProps> = async ({ params }) => {
  const answerData = await getCaseAnswer(params.id);
  //@ts-expect-error
  const caseDetails = await getCaseDetails(answerData?.caseId);
  //@ts-expect-error
  const formattedResponses = answerData?.responses
    ? //@ts-expect-error
      JSON.parse(answerData.responses).map((response: any, index: number) => (
        <div key={index}>
          <strong className=" capitalize">{response.role}:</strong>{" "}
          {response.response}
        </div>
      ))
    : null;

  return (
    <div className="flex justify-start items-start gap-2 w-full h-full">
      <div className="min-w-[70%] h-full border-r p-6">
        <Feedback
          caseDetails={caseDetails}
          //@ts-expect-error
          feedbackServer={JSON.parse(answerData?.feedback)}
        />
      </div>
      <div className="min-w-[30%] h-full p-6 space-y-4">
        <h1 className="text-xl font-medium mb-6">Conversation history</h1>
        {formattedResponses}
      </div>
    </div>
  );
};

export default FeedbackPage;
