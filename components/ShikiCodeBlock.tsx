import { codeToHtml } from "shiki";
import {
  transformerNotationHighlight,
  transformerNotationDiff
} from "@shikijs/transformers";
import type { BundledLanguage, BundledTheme } from "shiki";
// import CopyToClipboard from "./CopyToClipboard";
import { useState } from "react";

type Props = {
  code: string;
  // lang?: BundledLanguage;
  lang?: string;
  theme?: BundledTheme;
  filename?: string;
};
export default function CodeBlock({
  code,
  lang = "javascript",
  theme = "nord",
  filename
}: Props) {
  const [html, setHtml] = useState<string>("");
  codeToHtml(code, {
    lang,
    theme,
    transformers: [transformerNotationHighlight(), transformerNotationDiff()]
  }).then((res) => setHtml(res));

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-800 py-2 pl-2 pr-4 text-sm">
        <span className="-mb-[calc(0.5rem+2px)] rounded-t-lg border-2 text-white border-white/5 border-b-neutral-700 bg-neutral-800 px-4 py-2 ">
          {lang}
        </span>
        {/* <CopyToClipboard code={code ? code : filename ? filename : "bash"} /> */}
      </div>
      <div
        className="border-t-2 border-neutral-700 text-sm [&>pre]:overflow-x-auto [&>pre]:!bg-neutral-900 [&>pre]:py-3 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}
