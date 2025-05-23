// FilingSummaryPreview.tsx
"use client";

interface FilingSummaryPreviewProps {
  selectedTags: Record<string, string>;
  onTagSelect: (placeholder: string) => void;
}

export const FilingSummaryPreview = ({
  selectedTags,
  onTagSelect,
}: FilingSummaryPreviewProps) => {
    function handleSelect(arg0: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="space-y-4">
      {/* Filing Summary Section */}
      <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filing Summary</h2>
        <div className="border p-4 rounded-md bg-white text-black">
          <p>
            <strong>Company Name:</strong>{" "}
            {selectedTags.companyName ? (
              selectedTags.companyName
            ) : (
              <button
                onClick={() => onTagSelect("companyName")}
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
                onClick={() => onTagSelect("formType")}
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
                onClick={() => onTagSelect("filingDate")}
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
                onClick={() => onTagSelect("cik")}
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
                onClick={() => onTagSelect("FilingURL")}
                className="cursor-pointer underline text-black"
              >
                {"{{FilingURL}}"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Financial Summary Table */}
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
                      onClick={() => onTagSelect("RevenueQ1")}
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
                      onClick={() => onTagSelect("RevenueQ2")}
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
                      onClick={() => onTagSelect("RevenueQ3")}
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
                      onClick={() => onTagSelect("RevenueQ4")}
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
                      onClick={() => onTagSelect("IncomeQ1")}
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
                      onClick={() => onTagSelect("IncomeQ2")}
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
                      onClick={() => onTagSelect("IncomeQ3")}
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
                      onClick={() => onTagSelect("IncomeQ4")}
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
                      onClick={() => onTagSelect("DQ1")}
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
                      onClick={() => onTagSelect("DQ2")}
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
                      onClick={() => onTagSelect("DQ3")}
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
                      onClick={() => onTagSelect("DQ4")}
                      className="cursor-pointer underline bg-transparent border-none"
                    >
                      {"{{DQ4}}"}
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-4 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-lg font-semibold">Risk Factors</h2>
        <p className="mt-2">
          {selectedTags.RiskFactors ? (
            selectedTags.RiskFactors
          ) : (
            <button
              onClick={() => onTagSelect("RiskFactors")}
              className="cursor-pointer underline text-black"
            >
              {"{{RiskFactors}}"}
            </button>
          )}
        </p>
      </div>
        </div>
      </div>
    </div>
  );
};