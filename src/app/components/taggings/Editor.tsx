"use client";

import { useState, useRef, useEffect } from "react";

const TemplateEditor = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlContent(content);
      setOutputHtml(content);
      if (iframeRef.current) {
        iframeRef.current.srcdoc = content;
      }
      setPlaceholders([]);
    };
    reader.readAsText(file);
  };

  // Initialize iframe and selection handling
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      setIsIframeLoaded(true);
      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      const handleSelection = () => {
        const selection = doc.getSelection();
        if (!selection || selection.isCollapsed) {
          setSelectedText("");
          return;
        }
      
        const range = selection.getRangeAt(0);
        const parentCell = range.startContainer?.parentElement?.closest("td, th");
      
        const selected = selection.toString().trim();
      
        if (!selected || (parentCell && !parentCell.innerHTML.includes(selected))) {
          console.warn("Selection content mismatch, retrying...");
          return;
        }
        
        setSelectedText(selected);
      };

      doc.addEventListener('mouseup', handleSelection);
      doc.addEventListener('keyup', handleSelection);

      return () => {
        doc.removeEventListener('mouseup', handleSelection);
        doc.removeEventListener('keyup', handleSelection);
      };
    };

    iframe.addEventListener('load', handleLoad);
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  // Improved tag selection with better table handling
  const tagSelection = (placeholder: string) => {
    const iframe = iframeRef.current;
    if (!iframe || !selectedText) return;

    const doc = iframe.contentWindow?.document;
    const selection = iframe.contentWindow?.getSelection();
    if (!doc || !selection || selection.rangeCount === 0) return;

    try {
      const range = selection.getRangeAt(0);
      const parentCell = range.startContainer.parentElement?.closest('td, th');
      
      // Create placeholder element
      const placeholderSpan = doc.createElement('span');
      placeholderSpan.className = 'placeholder bg-yellow-100 px-1 rounded';
      placeholderSpan.textContent = `{{${placeholder}}}`;
      placeholderSpan.setAttribute('data-placeholder', placeholder);

      // Special handling for table cells
      if (parentCell) {
        const cellContent = parentCell.innerHTML;
        const selectedContent = range.toString();
        const newContent = cellContent.replace(
          selectedContent, 
          placeholderSpan.outerHTML
        );
        parentCell.innerHTML = newContent;
      } else {
        range.deleteContents();
        range.insertNode(placeholderSpan);
      }

      // Update HTML content
      const newHtml = doc.documentElement.outerHTML;
      setHtmlContent(newHtml);
      setOutputHtml(newHtml);
      setPlaceholders(prev => [...new Set([...prev, `{{${placeholder}}}`])]);
      
      // Clear selection
      selection.removeAllRanges();
      setSelectedText("");
      
      // Refresh iframe to ensure proper rendering
      iframe.srcdoc = newHtml;
    } catch (error) {
      console.error("Error tagging selection:", error);
    }
  };

  // Download HTML file
  const downloadHtml = () => {
    if (!htmlContent) return;

    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    
    // Use the original filename if available, otherwise default to 'template.html'
    a.download = fileName || 'template.html';
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">SEC Filing Template Editor</h1>
              <p className="text-gray-600">Convert static HTML into dynamic templates</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".html,.htm"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Upload HTML
                </label>
              </div>
              {fileName && (
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{fileName}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tagging Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tag Variables */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Tag Variables</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {[
                    "companyName", "FilingDate", "FormType", "CIK", "FilingURL",
                    "RiskFactors", "RevenueQ1", "RevenueQ2", "RevenueQ3", "RevenueQ4",
                    "NetIncomeQ1", "NetIncomeQ2", "NetIncomeQ3", "NetIncomeQ4",
                    "DividendQ1", "DividendQ2", "DividendQ3", "DividendQ4"
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => tagSelection(tag)}
                      disabled={!selectedText || !isIframeLoaded}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                        selectedText && isIframeLoaded
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                          : "bg-gray-50 text-gray-400 border border-gray-200"
                      }`}
                    >
                      <span className="font-mono">{`{{${tag}}}`}</span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {tag.includes("Revenue") ? "Financial data" : 
                         tag.includes("Date") ? "Date field" : 
                         tag.includes("Name") ? "Company identifier" : "Field"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Text Preview */}
              {selectedText && (
                <div className="p-4 border-t border-gray-100 bg-blue-50">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Selected Text</h3>
                  <div className="bg-white p-3 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 font-mono">"{selectedText}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tagged Variables */}
            <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Tagged Variables</h2>
              </div>
              <div className="p-4">
                {placeholders.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {placeholders.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block bg-yellow-100 px-3 py-1 rounded-full text-sm font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 mt-2">No variables tagged yet</p>
                    <p className="text-xs text-gray-400 mt-1">Select text and choose a variable</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Template Preview */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Template Preview</h2>
                <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {isIframeLoaded ? "Select text to tag" : "Loading document..."}
                </span>
              </div>
              <div className="p-1">
                <iframe
                  ref={iframeRef}
                  className="w-full h-[500px] border-0 rounded-b-lg"
                  sandbox="allow-same-origin"
                  title="Template Preview"
                  onLoad={() => setIsIframeLoaded(true)}
                />
              </div>
            </div>

            {/* HTML Output */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">HTML Output</h2>
                <button
                  onClick={downloadHtml}
                  disabled={!htmlContent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download HTML
                </button>
              </div>
              <div className="p-4">
                <div className="bg-gray-800 rounded-lg p-4 h-[600px] overflow-auto">
                  <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                    {outputHtml || (
                      <div className="text-center text-gray-500 py-16">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mt-2">HTML output will appear here</p>
                      </div>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;