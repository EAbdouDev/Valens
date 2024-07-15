import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { AnswerSection } from "@/components/note-assist/answer-section";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function writer(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  let fullResponse = "";
  let hasError = false;
  const streamableAnswer = createStreamableValue<string>("");
  const answerSection = <AnswerSection result={streamableAnswer.value} />;
  uiStream.append(answerSection);

  const google = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY,
  });

  await streamText({
    model: google("models/gemini-1.5-pro-latest"),

    system: `As a professional writer, your job is to generate a comprehensive and informative, yet concise answer of 1000 words or less for the given question based solely on the provided search results (URL and content). You must only use information from the provided search results. Use an unbiased and journalistic and medical tone. Combine search results together into a coherent answer. Do not repeat text. If there are any images relevant to your answer, be sure to include them as well. Aim to directly address the user's question, augmenting your response with insights gleaned from the search results. 
    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly. Please match the language of the response to the user's language.
    Always answer in Markdown format. Links and images must follow the correct format.
    Link format: [link text](url)
    Image format: ![alt text](url)
    `,
    messages,
    onFinish: (event) => {
      fullResponse = event.text;
      streamableAnswer.done(event.text);
    },
  })
    .then(async (result) => {
      for await (const text of result.textStream) {
        if (text) {
          fullResponse += text;
          streamableAnswer.update(fullResponse);
        }
      }
    })
    .catch((err) => {
      hasError = true;
      fullResponse = "Error: " + err.message;
      streamableAnswer.update(fullResponse);
    });

  return { response: fullResponse, hasError };
}
