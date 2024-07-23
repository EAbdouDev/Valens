import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const exampleMessages = [
  {
    heading: "What cause liver failure?",
    message: "What cause liver failure?",
  },
  {
    heading: "Why is Telemedicine growing rapidly?",
    message: "Why is Telemedicine growing rapidly?",
  },

  {
    heading: "CT Scan vs MRI: What's the difference?",
    message: "CT Scan vs MRI: What's the difference?",
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
