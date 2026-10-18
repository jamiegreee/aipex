import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function BriefPreview({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h2 className="brief-document-title">{children}</h2>
        ),
        h2: ({ children }) => <h3>{children}</h3>,
        h3: ({ children }) => <h4>{children}</h4>,
        table: ({ children }) => (
          <div
            className="lesson-table-scroll"
            role="region"
            aria-label="Draft table"
            tabIndex={0}
          >
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
