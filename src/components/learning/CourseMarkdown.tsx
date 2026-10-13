import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CourseMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div
            className="lesson-table-scroll"
            role="region"
            aria-label="Case evidence table"
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
