import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { UserContext, UserContextProps } from "@/pages/_app";
import remarkGfm from "remark-gfm";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

interface MarkdownProps {
  markdown: string;
  className?: string;
}

export default function Markdown(props: MarkdownProps) {
  const { theme } = useContext<UserContextProps>(UserContext);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={`react-markdown max-w-2xl ${props.className}`}
      components={{
        code({
          node,
          inline,
          className,
          children,
          ...rest
        }: {
          node?: any;
          inline?: boolean;
          className?: string;
          children: React.ReactNode;
        }) {
          const match = /language-(\w+)/.exec(className || "");

          const copyToClipboard = (text: string) => {
            navigator.clipboard.writeText(text);
          };

          return !inline && match ? (
            <div className="relative group">
              <SyntaxHighlighter
                className="not-prose"
                style={theme === "light" ? vs : (vscDarkPlus as any)}
                customStyle={{
                  backgroundColor:
                    theme === "light" ? "#FFFFFF00" : "transparent",
                  border: "none",
                  opacity: "1",
                }}
                language={match[1]}
                PreTag="div"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>

              {/* Show copy button on hover */}
              <button
                onClick={() => copyToClipboard(String(children))}
                className="group hidden group-hover:inline-block absolute top-1 right-2 p-1.5 rounded-md shadow bg-white dark:bg-neutral-800 hover:bg-neutral-50 hover:dark:bg-neutral-700 active:bg-primary active:dark:bg-primary active:text-white border border-neutral-300 dark:border-neutral-600"
              >
                <ClipboardDocumentIcon className="w-5 h-5 inline-block stroke-neutral-600 dark:stroke-neutral-300 active:stroke-white" />
              </button>
            </div>
          ) : (
            <span className="not-prose font-medium">
              <code
                {...rest}
                className={
                  "text-sm text-black dark:text-[#D7BA7D] bg-black/[8%] dark:bg-transparent rounded-md py-0.5 px-1"
                }
              >
                {children}
              </code>
            </span>
          );
        },
      }}
    >
      {props.markdown}
    </ReactMarkdown>
  );
}
