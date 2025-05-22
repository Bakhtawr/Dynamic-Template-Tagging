"use client";  // Ensures client-side execution

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
    { type: "paragraph", children: [{ text: "Welcome to ACME Corp. Your appointment is on Date 22/5/2025. We value your time and look forward to seeing you on Monday." }] },
  ]);

  const handleSelect = (placeholder: string) => {
    const { selection } = editor;
    if (selection) {
      Transforms.insertText(editor, `{{${placeholder}}}`, { at: selection });
    }
  };

  return (
    <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="space-y-4 p-4 bg-gray-100 rounded-md shadow-md ">
        <h2 className="text-lg font-semibold">Tag Variables</h2>
        <div>
        <button onClick={() => handleSelect("companyName")} className="px-4 py-2 bg-blue-500 text-white rounded">
          Tag as {`{{companyName}}`}
        </button>
        </div>
       
        <button onClick={() => handleSelect("appointmentDay")} className="px-4 py-2 bg-green-500 text-white rounded">
          Tag as {`{{appointmentDay}}`}
        </button>
       
      </div>
  

      <div className="p-4 border rounded-md shadow-md bg-white min-h-[40vh] md:min-h-[400px]">
        <h2 className="text-lg font-semibold">Editing Area</h2>
        <Slate editor={editor as ReactEditor} initialValue={value} onChange={setValue}>
          <Editable className="border p-4 rounded-md min-h-[300px] w-full text-black bg-white" />
        </Slate>
      </div>
    </div>
  
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
  <h2 className="text-lg font-semibold">HTML Preview</h2>
  <div className="border p-3 rounded-md bg-white text-gray-700 whitespace-pre-wrap">
    {value.map((node, index) => {
      if ('children' in node) {  
        return (
          <p key={index}>
            {node.children.map((child) => 'text' in child ? child.text : "").join("")}
          </p>
        );
      }
      return null;
    })}
  </div>
</div>

  </div>
  
  );
};

export default RichTextEditor;
