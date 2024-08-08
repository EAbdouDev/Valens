"use client";
import { FC, useEffect, useState } from "react";
import { generateFeedback } from "./actions";
import { BotMessage } from "../note-assist/message";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface FeedbackProps {
  feedbackServer: any;
  caseDetails: any;
}

const Feedback: FC<FeedbackProps> = ({ feedbackServer, caseDetails }) => {
  const [feedback, setFeedback] = useState<any>(feedbackServer);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFeedback(feedbackServer);
  }, [feedbackServer]);

  const getColor = (score: number) => {
    if (score >= 75) return "var(--color-green)";
    if (score >= 50) return "var(--color-yellow)";
    return "var(--color-red)";
  };

  if (!feedback) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="mb-10 text-2xl font-semibold">
        {caseDetails?.title} Feedback Report
      </h1>
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar
          value={feedback.communicationSkillsScore}
          text={`${feedback.communicationSkillsScore}%`}
          styles={buildStyles({
            pathColor: getColor(feedback.communicationSkillsScore),
            textColor: getColor(feedback.communicationSkillsScore),
          })}
        />
      </div>
      <div>
        <h1 className="text-lg font-medium mb-2">Communication Skills</h1>
        <p>
          <BotMessage content={feedback.communicationSkillsFeedback} />
        </p>
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Diagnosis Feedback</h1>
        <p>
          <BotMessage content={feedback.diagnosisFeedback} />
        </p>
      </div>

      <div>
        <h1 className="text-lg font-medium mb-2">Treatment Plan Feedback</h1>
        <p>
          <BotMessage content={feedback.treatmentPlanFeedback} />
        </p>
      </div>
    </div>
  );
};

export default Feedback;
