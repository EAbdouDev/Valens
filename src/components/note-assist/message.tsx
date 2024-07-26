"use client";

import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export function BotMessage({ content }: { content: string }) {
  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );

  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedData = preprocessLaTeX(content || "");

  if (containsLaTeX) {
    return (
      <MemoizedReactMarkdown
        rehypePlugins={[
          [rehypeExternalLinks, { target: "_blank" }],
          rehypeKatex,
        ]}
        remarkPlugins={[remarkGfm, remarkMath]}
        className="prose prose-lg text-gray-800 leading-relaxed space-y-4"
      >
        {processedData}
      </MemoizedReactMarkdown>
    );
  }

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
      remarkPlugins={[remarkGfm]}
      className="prose prose-lg text-gray-800 leading-relaxed space-y-4"
    >
      {content}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
