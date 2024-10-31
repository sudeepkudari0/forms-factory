import dynamic from "next/dynamic";
import type React from "react";
import type { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

// Type definitions
interface QuillModules {
  toolbar: (string[] | { [key: string]: string[] | boolean }[] | string)[];
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

// Dynamic import with TypeScript
const ReactQuill = dynamic<ReactQuillProps>(
  async () => {
    const { default: QuillComponent } = await import("react-quill");
    return QuillComponent;
  },
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

// Rich Text Editor Component
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const handleChange = (content: string): void => {
    onChange(content);
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white min-h-[200px]"
      />
    </div>
  );
};

// Rich Text Display Component
export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className={`prose max-w-none ${className}`}
    />
  );
};
