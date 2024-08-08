"use client";

import { Section } from "./section";
import { BotMessage } from "./message";

export type AnswerSectionProps = {
  result: string;
};

export function AnswerSectionGenerated({ result }: AnswerSectionProps) {
  return (
    <div>
      <Section title="Gemini Answer">
        <BotMessage content={result} />
      </Section>
    </div>
  );
}
