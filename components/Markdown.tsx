/* eslint-disable react/display-name */
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import supersub from "remark-supersub";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Message } from "ai";
import type { PluggableList } from "unified";
import { cn, langSubset, processLaTeX, validateIframe } from "@/utils";
import CodeBlock from "./CodeBlock";
type TCodeProps = {
  inline: boolean;
  className: string;
  children: React.ReactNode;
};

type TContentProps = {
  content: string;
  showCursor?: boolean;
  isGenerating?: boolean;
  isLatestMessage?: boolean;
};

export const code = memo(({ inline, className, children }: TCodeProps) => {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || "text"} codeChildren={children} />;
  }
});

const p = React.memo(({ children }: { children: React.ReactNode }) => {
  return <p className="whitespace-pre-wrap">{children}</p>;
});

const cursor = " ";
const Markdown = memo(
  ({
    content,
    showCursor,
    isGenerating = false,
    isLatestMessage = false
  }: TContentProps) => {
    const isInitializing = content === "";

    let currentContent = content;
    if (!isInitializing) {
      currentContent = currentContent?.replace("z-index: 1;", "") ?? "";
      currentContent = processLaTeX(content);
    }

    const rehypePlugins: PluggableList = [
      [rehypeKatex, { output: "mathml" }],
      [
        rehypeHighlight,
        {
          detect: true,
          ignoreMissing: true,
          subset: langSubset
        }
      ],
      [rehypeRaw]
    ];

    if (isInitializing) {
      rehypePlugins.pop();
      return (
        <div className="absolute">
          <p className="relative">
            <span className={cn(isGenerating ? `result-thinking` : "")} />
          </p>
        </div>
      );
    }

    let isValidIframe: string | boolean | null = false;
    isValidIframe = validateIframe(currentContent);

    return (
      <ReactMarkdown
        remarkPlugins={[
          supersub,
          remarkGfm,
          [remarkMath, { singleDollarTextMath: true }]
        ]}
        rehypePlugins={rehypePlugins}
        components={
          {
            code,
            // a,
            p
          } as {
            [nodeType: string]: React.ElementType;
          }
        }
      >
        {isLatestMessage && isGenerating && !isInitializing && showCursor
          ? currentContent + cursor
          : currentContent}
      </ReactMarkdown>
    );
  }
);

export default Markdown;
