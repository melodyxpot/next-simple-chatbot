/* eslint-disable react/display-name */
import React, { FC, ReactNode, memo, useEffect, useState } from "react";
import ReactMarkdown, { Options } from "react-markdown";
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
// import ShikiCodeBlock from "@/components/ShikiCodeBlock";
// import { BundledLanguage } from "shiki";

type TCodeProps = {
  inline: boolean;
  className: string;
  children: React.ReactNode;
};

type TContentProps = {
  content: string;
  message: Message;
  showCursor?: boolean;
  isGenerating?: boolean;
  isLatestMessage?: boolean;
  messages?: Message[];
};

// const MemoizedReactMarkdown: FC<Options> = memo(
//   ReactMarkdown,
//   (prevProps, nextProps) =>
//     prevProps.children === nextProps.children &&
//     prevProps.className === nextProps.className
// );

// export const a = memo(
//   ({ href, children }: { href: string; children: React.ReactNode }) => {
//     const user = useRecoilValue(store.user);
//     const { showToast } = useToastContext();
//     const localize = useLocalize();

//     const { filepath, filename } = useMemo(() => {
//       const pattern = new RegExp(`(?:files|outputs)/${user?.id}/([^\\s]+)`);
//       const match = href.match(pattern);
//       if (match && match[0]) {
//         const path = match[0];
//         const name = path.split("/").pop();
//         return { filepath: path, filename: name };
//       }
//       return { filepath: "", filename: "" };
//     }, [user?.id, href]);

//     // const { refetch: downloadFile } = useFileDownload(user?.id ?? '', filepath);
//     const props: { target?: string; onClick?: React.MouseEventHandler } = {
//       target: "_new"
//     };

//     if (!filepath || !filename) {
//       return (
//         <a href={href} {...props}>
//           {children}
//         </a>
//       );
//     }

//     const handleDownload = async (
//       event: React.MouseEvent<HTMLAnchorElement>
//     ) => {
//       event.preventDefault();
//       try {
//         // const stream = await downloadFile();
//         // if (!stream.data) {
//         //   console.error('Error downloading file: No data found');
//         //   showToast({
//         //     status: 'error',
//         //     message: localize('com_ui_download_error'),
//         //   });
//         //   return;
//         // }
//         // const link = document.createElement('a');
//         // link.href = stream.data;
//         // link.setAttribute('download', filename);
//         // document.body.appendChild(link);
//         // link.click();
//         // document.body.removeChild(link);
//         // window.URL.revokeObjectURL(stream.data);
//       } catch (error) {
//         console.error("Error downloading file:", error);
//       }
//     };

//     props.onClick = handleDownload;
//     props.target = "_blank";

//     return (
//       <a
//         href={
//           filepath.startsWith("files/")
//             ? `/api/${filepath}`
//             : `/api/files/${filepath}`
//         }
//         {...props}
//       >
//         {children}
//       </a>
//     );
//   }
// );

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
    message,
    showCursor,
    isGenerating = false,
    isLatestMessage = false,
    messages
  }: TContentProps) => {
    // const LaTeXParsing = useRecoilValue<boolean>(store.LaTeXParsing);

    const isInitializing = content === "";

    // const { isEdited, messageId } = message ?? {};
    // const isLatestMessage = messageId === latestMessage?.messageId;

    let currentContent = content;
    if (!isInitializing) {
      currentContent = currentContent?.replace("z-index: 1;", "") ?? "";
      // currentContent = LaTeXParsing ? processLaTeX(currentContent) : currentContent;
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
    // if (!isEdited) {
    isValidIframe = validateIframe(currentContent);
    // }

    // if (isEdited || ((!isInitializing || !isLatestMessage) && !isValidIframe)) {
    // rehypePlugins.pop();
    // }

    return (
      <ReactMarkdown
        remarkPlugins={[
          supersub,
          remarkGfm,
          [remarkMath, { singleDollarTextMath: true }]
        ]}
        rehypePlugins={rehypePlugins}
        // linkTarget="_new"
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
