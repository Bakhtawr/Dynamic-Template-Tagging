"use client";  // Add this at the very top

import { Descendant, createEditor, Transforms } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { useState, useMemo } from "react";

// Define types for Slate.js
type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const RichTextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "Welcome to ACME Corp. Your appointment is on Monday." }] },
  ]);

  const handleSelect = (placeholder: string) => {
    const { selection } = editor;
    if (selection) {
      Transforms.insertText(editor, `{{${placeholder}}}`, { at: selection });
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white shadow-md">
      <Slate editor={editor as ReactEditor} initialValue={value} onChange={setValue}>
        <Editable className="border p-3 rounded-md min-h-[100px]" />
      </Slate>
      <div className="mt-3 space-x-2">
        <button onClick={() => handleSelect("companyName")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Tag as {`{{companyName}}`}
        </button>
        <button onClick={() => handleSelect("appointmentDay")} className="px-4 py-2 bg-green-500 text-white rounded">
          Tag as {`{{appointmentDay}}`}
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
