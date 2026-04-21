import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


const AIParser: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="ai-container">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AIParser;