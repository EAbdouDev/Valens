import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const exampleMessages = [
  {
    heading: "What is Apple Intelligence?",
    message: "What is Apple Intelligence?",
  },
  {
    heading: "Why is Nvidia growing rapidly?",
    message: "Why is Nvidia growing rapidly?",
  },
  {
    heading: "How does the Vercel AI SDK work?",
    message: "How does the Vercel AI SDK work?",
  },
  {
    heading: "Tesla vs Rivian",
    message: "Tesla vs Rivian",
  },
];
export function EmptyScreen({
  submitMessage,
  className,
}: {
  submitMessage: (message: string) => void;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className=" rounded-2xl p-2">
        <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message);
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
