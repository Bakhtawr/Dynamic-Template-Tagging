"use client";

interface HtmlPreviewProps {
  selectedTags: Record<string, string>;
}

// Function to generate dynamic HTML preview
const generateHtmlPreview = (selectedTags: Record<string, string>): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEC Filing Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .section { margin-bottom: 15px; }
          .label { font-weight: bold; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>SEC Filing Summary</h1>
        
        <div class="section">
          <div class="label">Company Name:</div>
          <div>${selectedTags.companyName || "{{company_name}}"}</div>
        </div>
  
        <div class="section">
          <div class="label">Form Type:</div>
          <div>${selectedTags.formType || "{{form_type}}"}</div>
        </div>
  
        <div class="section">
          <div class="label">Filing Date:</div>
          <div>${selectedTags.filingDate || "{{filing_date}}"}</div>
        </div>
  
        <div class="section">
          <div class="label">CIK:</div>
          <div>${selectedTags.cik || "{{cik}}"}</div>
        </div>
  
        <div class="section">
          <div class="label">Filing URL:</div>
          <div><a href="${selectedTags.FilingURL || '#'}" target="_blank">${selectedTags.FilingURL || "{{filing_url}}"}</a></div>
        </div>
  
        <!-- Financial Summary Table -->
        <h2>Financial Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Revenue</td>
              <td>${selectedTags.RevenueQ1 || "{{RevenueQ1}}"}</td>
              <td>${selectedTags.RevenueQ2 || "{{RevenueQ2}}"}</td>
              <td>${selectedTags.RevenueQ3 || "{{RevenueQ3}}"}</td>
              <td>${selectedTags.RevenueQ4 || "{{RevenueQ4}}"}</td>
            </tr>
            <tr>
              <td>Net Income</td>
              <td>${selectedTags.IncomeQ1 || "{{IncomeQ1}}"}</td>
              <td>${selectedTags.IncomeQ2 || "{{IncomeQ2}}"}</td>
              <td>${selectedTags.IncomeQ3 || "{{IncomeQ3}}"}</td>
              <td>${selectedTags.IncomeQ4 || "{{IncomeQ4}}"}</td>
            </tr>
            <tr>
              <td>Dividends</td>
              <td>${selectedTags.DQ1 || "{{DQ1}}"}</td>
              <td>${selectedTags.DQ2 || "{{DQ2}}"}</td>
              <td>${selectedTags.DQ3 || "{{DQ3}}"}</td>
              <td>${selectedTags.DQ4 || "{{DQ4}}"}</td>
            </tr>
          </tbody>
        </table>
  
        <h2>Risk Factors</h2>
        <p>${selectedTags.RiskFactors || "{{RiskFactors}}"}</p>
      </body>
      </html>
    `;
  };
  

// Function to handle HTML file download
const downloadHtmlFile = (selectedTags: Record<string, string>) => {
  const htmlContent: string = generateHtmlPreview(selectedTags); // Generate the preview HTML
  const blob = new Blob([htmlContent], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "SEC_Filing_Summary.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const HtmlPreview = ({ selectedTags }: HtmlPreviewProps) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold">HTML Preview</h2>
      <div className="mt-4 p-4 bg-white border rounded-md">
        <div dangerouslySetInnerHTML={{ __html: generateHtmlPreview(selectedTags) }} />
      </div>
      <button
        onClick={() => downloadHtmlFile(selectedTags)} // Integrated directly
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
      >
        Download HTML
      </button>
    </div>
  );
};

export default HtmlPreview;
