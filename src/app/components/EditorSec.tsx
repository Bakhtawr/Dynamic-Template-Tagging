"use client";

import { useState, useMemo, useEffect } from "react";
import { createEditor, Descendant, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";

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
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string }>({});
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
              <h2 className="text-xl font-bold text-gray-700 mb-4">Upload File (PDF)</h2>

              <input
                type="file"
                accept="application/pdf"
                onChange={extractText}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isLoading && <p className="mt-2 text-blue-500">Extracting text...</p>}
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-4">Text Editor</h2>
            <Slate editor={editor} initialValue={value} onChange={setValue}>
              <Editable className="border p-4 rounded-md min-h-[370px] w-full text-black bg-white" />
            </Slate>
          </div>
        </div>

        {/* Right Column - HTML Preview */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Filing Summary</h2>
            <div className="border p-4 rounded-md bg-white text-gray-700">
              <p>
                <strong>Company Name:</strong>{" "}
                {selectedTags.companyName ? (
                  selectedTags.companyName
                ) : (
                  <button
                    onClick={() => handleSelect("companyName")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{company_name}}"}
                  </button>
                )}
              </p>

              <p className="mt-2">
                <strong>Form Type:</strong>{" "}
                {selectedTags.formType ? (
                  selectedTags.formType
                ) : (
                  <button
                    onClick={() => handleSelect("formType")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{form_type}}"}
                  </button>
                )}
              </p>

              <p className="mt-2">
                <strong>Filing Date:</strong>{" "}
                {selectedTags.filingDate ? (
                  selectedTags.filingDate
                ) : (
                  <button
                    onClick={() => handleSelect("filingDate")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{filing_date}}"}
                  </button>
                )}
              </p>

              <p className="mt-2">
                <strong>CIK:</strong>{" "}
                {selectedTags.cik ? (
                  selectedTags.cik
                ) : (
                  <button
                    onClick={() => handleSelect("cik")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{cik}}"}
                  </button>
                )}
              </p>
              <p className="mt-2">
                <strong>Filing URL:</strong>{" "}
                {selectedTags.FilingURL ? (
                  selectedTags.FilingURL
                ) : (
                  <button
                    onClick={() => handleSelect("FilingURL")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{FilingURL}}"}
                  </button>
                )}
              </p>
             
            </div>
          </div>
          {/* Financial Summary Table - Full width below */}
          <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
            <div className="overflow-x-auto">
              <table className="border-collapse border border-gray-400 w-full table-fixed">
                <thead>
                  <tr className="border border-gray-300 bg-gray-100">
                    <th className="w-1/5 p-3">Metric</th>
                    <th className="w-1/5 p-3">Q1</th>
                    <th className="w-1/5 p-3">Q2</th>
                    <th className="w-1/5 p-3">Q3</th>
                    <th className="w-1/5 p-3">Q4</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {/* Revenue Row */}
                  <tr className="border border-gray-300">
                    <td className="p-3">Revenue</td>
                    <td className="p-3">
                      {selectedTags.RevenueQ1 ? (
                        selectedTags.RevenueQ1
                      ) : (
                        <button
                          onClick={() => handleSelect("RevenueQ1")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{RevenueQ1}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.RevenueQ2 ? (
                        selectedTags.RevenueQ2
                      ) : (
                        <button
                          onClick={() => handleSelect("RevenueQ2")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{RevenueQ2}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.RevenueQ3 ? (
                        selectedTags.RevenueQ3
                      ) : (
                        <button
                          onClick={() => handleSelect("RevenueQ3")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{RevenueQ3}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.RevenueQ4 ? (
                        selectedTags.RevenueQ4
                      ) : (
                        <button
                          onClick={() => handleSelect("RevenueQ4")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{RevenueQ4}}"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Net Income Row */}
                  <tr className="border border-gray-300">
                    <td className="p-3">Net Income</td>
                    <td className="p-3">
                      {selectedTags.IncomeQ1 ? (
                        selectedTags.IncomeQ1
                      ) : (
                        <button
                          onClick={() => handleSelect("IncomeQ1")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{IncomeQ1}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.IncomeQ2 ? (
                        selectedTags.IncomeQ2
                      ) : (
                        <button
                          onClick={() => handleSelect("IncomeQ2")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{IncomeQ2}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.IncomeQ3 ? (
                        selectedTags.IncomeQ3
                      ) : (
                        <button
                          onClick={() => handleSelect("IncomeQ3")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{IncomeQ3}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.IncomeQ4 ? (
                        selectedTags.IncomeQ4
                      ) : (
                        <button
                          onClick={() => handleSelect("IncomeQ4")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{IncomeQ4}}"}
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Dividend Row */}
                  <tr className="border border-gray-300">
                    <td className="p-3">Dividend</td>
                    <td className="p-3">
                      {selectedTags.DQ1 ? (
                        selectedTags.DQ1
                      ) : (
                        <button
                          onClick={() => handleSelect("DQ1")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{DQ1}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.DQ2 ? (
                        selectedTags.DQ2
                      ) : (
                        <button
                          onClick={() => handleSelect("DQ2")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{DQ2}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.DQ3 ? (
                        selectedTags.DQ3
                      ) : (
                        <button
                          onClick={() => handleSelect("DQ3")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{DQ3}}"}
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      {selectedTags.DQ4 ? (
                        selectedTags.DQ4
                      ) : (
                        <button
                          onClick={() => handleSelect("DQ4")}
                          className="cursor-pointer underline bg-transparent border-none"
                        >
                          {"{{DQ4}}"}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors Section - Full width below */}
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-lg font-semibold">Risk Factors</h2>
        <p className="mt-2">
          {selectedTags.RiskFactors ? (
            selectedTags.RiskFactors
          ) : (
            <button
              onClick={() => handleSelect("RiskFactors")}
              className="cursor-pointer underline text-black"
            >
              {"{{RiskFactors}}"}
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default RichTextEditorSec;
