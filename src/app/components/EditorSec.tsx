"use client";

import { Descendant, createEditor, Transforms } from "slate";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { useState, useMemo } from "react";

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

  // Stores user-selected tags, starts empty
  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string }>(
    {}
  );
  const [value, setValue] = useState<Descendant[]>([
    {
      type: "paragraph",
      children: [
        {
          text: `Apple Inc. has filed its 10-K report, detailing its financial performance for the year. The filing, dated February 1, 2025, provides insights into the company's revenue, net income, and dividends across all four quarters Central Index Key 0000320193. For Q1, Apple reported a revenue of $123.9 billion, followed by $115.3 billion in Q2, $120.2 billion in Q3, and $129.8 billion in Q4. Net income fluctuated throughout the year, with $28.7 billion in Q1, $25.3 billion in Q2, $26.9 billion in Q3, and $30.4 billion in Q4. Dividend payouts were consistent, starting at $1.88 in Q1, slightly decreasing to $1.67 in Q2, before recovering to $1.73 in Q3 and $2.01 in Q4.
 
Beyond financials, the company acknowledges several risk factors that could impact performance. These include global supply chain disruptions, component shortages, evolving trade regulations, and privacy laws. Additionally, currency exchange fluctuations and economic instability in key markets pose potential challenges to Apple's future financial stability.
 
For further details, the official SEC filing is available at `,
        },
        {
          text: "View Filing",
          url: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000001/0000320193-25-000001-index.htm",
        },
      ],
    },
  ]);

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
      {/* Main Two-column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Paragraph Editor */}
        <div className="space-y-4">
          <div className="p-4 border rounded-md shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-4">Text Editor</h2>
            <Slate
              editor={editor as ReactEditor}
              initialValue={value}
              onChange={setValue}
            >
              <Editable className="border p-4 rounded-md min-h-[300px] w-full text-black bg-white" />
            </Slate>
          </div>
        </div>

        {/* Right Column - HTML Preview */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">HTML Preview</h2>
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
                  <a
                    href={selectedTags.FilingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    View Filing
                  </a>
                ) : (
                  <button
                    onClick={() => handleSelect("FilingURL")}
                    className="cursor-pointer underline text-black"
                  >
                    {"{{filing_url}}"}
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