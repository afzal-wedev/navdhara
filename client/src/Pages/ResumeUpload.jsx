import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

GlobalWorkerOptions.workerSrc = pdfWorker;


export const  ResumeUpload =()=> {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let textContent = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const pageText = text.items.map((item) => item.str).join(" ");
          textContent += pageText + "\n";
        }
        resolve(textContent);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    console.log("hits")
    if (!file) return alert("Please upload a PDF");

    const text = await extractTextFromPDF(file);

    // Send extracted text to backend
    const res = await fetch("http://localhost:5000/resume/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    try {
     
      setAnalysis(data); // Expecting structured JSON from backend
    } catch {
      alert("AI response not structured. Check backend prompt!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Upload Resume</h2>
        <input
          type="file"
          accept="application/pdf"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload & Analyze
        </button>
      </div>

      {analysis && (
        <div className="mt-8 space-y-6">
          {/* ATS Score */}
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">ATS Score</h3>
            <div className="w-full bg-gray-300 rounded-full h-5">
              <div
                className={`h-5 rounded-full ${
                  analysis["ATS Score"] > 70
                    ? "bg-green-500"
                    : analysis["ATS Score"] > 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${analysis["ATS Score"]}%` }}
              ></div>
            </div>
            <p className="mt-2 font-bold text-gray-700">
              {analysis["ATS Score"]} / 100
            </p>
          </div>

          {/* Strengths */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Strengths</h3>
            <ul className="list-disc pl-5 text-green-700">
              {analysis.Strengths?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Weaknesses</h3>
            <ul className="list-disc pl-5 text-red-700">
              {analysis.Weaknesses?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Suggestions</h3>
            <ul className="list-disc pl-5 text-blue-700">
              {analysis.Suggestions?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Extracted Skills */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis["Extracted Skills"]?.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{analysis.Summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
