import ReactMarkdown from "react-markdown";

/** Raw HTML in model output is not rendered (react-markdown default). */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-a:text-accent prose-code:text-accent">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
