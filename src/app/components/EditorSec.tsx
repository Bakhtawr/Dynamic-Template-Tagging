"use client";

import { useState, useMemo, useEffect } from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import {
  getDocument,
  GlobalWorkerOptions,
  version as pdfjsVersion,
} from "pdfjs-dist";
import { FilingSummaryPreview } from "./FilingSummaryPreview";
import HtmlPreview from "./HtmlPreview";



// Required to use pdfjs-dist worker
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

// Define Slate.js custom types
type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; url?: string };

declare module "slate" {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const RichTextEditorSec = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [extractedText, setExtractedText] = useState("");
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "Upload a PDF to extract text" }] },
  ]);
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  // Extract text from PDF
  const extractTextFromPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const pdf = await getDocument({ data: typedArray }).promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const extractText = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      setExtractedText(text);
    } catch (error) {
      console.error("Text extraction failed", error);
      setExtractedText("Failed to extract text from PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Update editor when PDF text changes
  useEffect(() => {
    if (extractedText) {
      const newValue: Descendant[] = [
        {
          type: "paragraph",
          children: [{ text: extractedText }],
        },
      ];
      setValue(newValue);
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      });
      editor.children = newValue;
    }
  }, [extractedText, editor]);

  const handleSelect = (placeholder: string) => {
    const { selection } = editor;
    if (selection) {
      const selectedText = window.getSelection()?.toString();
      if (selectedText) {
        setSelectedTags((prev) => ({ ...prev, [placeholder]: selectedText }));
        Transforms.insertText(editor, `{{${placeholder}}}`, { at: selection });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="space-y-4">
          <div className="rounded-md  bg-white">
            <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
              <h2 className="text-xl font-bold text-black mb-4">
                Upload File (PDF)
              </h2>
              <input
                type="file"
                accept="application/pdf"
                onChange={extractText}
                className="block w-full text-sm text-black border border-gray-300 rounded-md cursor-pointer bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isLoading && (
                <p className="mt-2 text-blue-500">Extracting text...</p>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-4">Text Editor</h2>
            <Slate editor={editor} initialValue={value} onChange={setValue}>
              <Editable className="border p-4 rounded-md min-h-[470px] w-full text-black bg-white" />
            </Slate>
          </div>
        </div>

        {/* Right Column - HTML Preview */}
        <div className="space-y-4">
          <FilingSummaryPreview
            selectedTags={selectedTags}
            onTagSelect={handleSelect}
          />
        </div>
      </div>

      {/* HTML Preview Section */}
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <HtmlPreview selectedTags={selectedTags} />
      </div>
    </div>
  );
};

export default RichTextEditorSec;
function generateHtmlPreview(selectedTags: { [key: string]: string; }) {
  throw new Error("Function not implemented.");
}

