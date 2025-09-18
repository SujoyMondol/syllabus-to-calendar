/* eslint-disable */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import dynamic from "next/dynamic";
import '../app/globals.css';
import { PDFDocumentProxy, TextItem } from "pdfjs-dist/types/src/display/api";
import axios from "axios";
import { useRouter } from 'next/navigation';


const loadPdfjs = async () => {
  const pdfjsLib = await import("pdfjs-dist/build/pdf.mjs");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - TS doesn’t understand worker export
  const workerSrc = await import("pdfjs-dist/build/pdf.worker.mjs");

  pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
    new Blob([workerSrc.default], { type: "application/javascript" })
  );

  return pdfjsLib;
};

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [extractedText, setExtractedText] = useState<string>('');
  const [calendarData, setCalendarData] = useState<any>(null);

  const router = useRouter();

  const redirectToCalendar = (calendarData : any) => {
    // localStorage.setItem("calendarData", JSON.stringify(calendarData));
    // router.push('/calendar');
    // const encoded = encodeURIComponent(JSON.stringify(calendarData));
    // router.push(`/calendar?data=${encoded}`);
  const encoded = encodeURIComponent(JSON.stringify(calendarData));
  router.push(`/calendar?data=${encoded}`);

    
    
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const convertPdfToDocx = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const base64 = Buffer.from(e.target?.result as ArrayBuffer).toString("base64");

        // Call API route
        const response = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBuffer: base64 }),
        });

        if (!response.ok) throw new Error("Server error during conversion");

        const { url } = await response.json();

        // Download converted DOCX file
        const docxResponse = await fetch(url);
        const arrayBuffer = await docxResponse.arrayBuffer();

        resolve(arrayBuffer);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};

  const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === "application/pdf") {
      // PDF → convert to DOCX first
      convertPdfToDocx(file)
        .then(async (arrayBuffer) => {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value.trim());
        })
        .catch(reject);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // DOCX → extract directly
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target?.result as ArrayBuffer,
          });
          resolve(result.value.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
};

  const sendToOpenAI = async (text: string) => {
    try {
      // Replace with your actual OpenAI API call
      const response = await fetch('/api/process-syllabus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process with OpenAI');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending to OpenAI:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      // Extract text from file
      const text = await extractTextFromFile(file);
      setExtractedText(text);
      
      // Send to OpenAI API
      const result = await sendToOpenAI(text);
      setCalendarData(result);
      
      
      setUploadStatus('success');
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SyllabusTo<span className="text-red-600">Calendar</span>
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/submit" className="px-4 py-2 rounded bg-white text-black transition-colors">
            Upload Syllabus
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Upload Your Syllabus</h1>
        <p className="text-gray-300 mb-8">
          Upload your syllabus in PDF or DOCX format, and we'll convert it into a calendar for you.
        </p>

        {/* Upload Card */}
        <div className="bg-white text-black rounded-lg p-8 shadow-xl">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="file"
                  id="syllabus-file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="syllabus-file"
                  className="cursor-pointer bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block"
                >
                  Choose File
                </label>
                {file && (
                  <p className="mt-4 text-sm">
                    Selected file: <span className="font-semibold">{file.name}</span>
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Supported formats: PDF, DOCX</p>
                <p>Max file size: 10MB</p>
              </div>
              
              <button
                type="submit"
                disabled={!file || isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  !file || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Convert to Calendar'}
              </button>
            </form>
            
            {/* Status Messages */}
            {uploadStatus === 'success' && calendarData && (
              
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
                <p className="font-semibold">Success!</p>
                <p>Your syllabus has been processed successfully.</p>
                {/* {calendarData && (
                  <div className="mt-4 text-left">
                    <h4 className="font-semibold">Extracted Calendar Events:</h4>
                    <pre className="text-xs overflow-auto max-h-40 mt-2 p-2 bg-green-200 rounded">
                      {JSON.stringify(calendarData, null, 2)}
                    </pre>
                  </div>
                )} */}
                <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={redirectToCalendar}>
                  Go To Calendar
                </button>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
                <p className="font-semibold">Error processing file</p>
                <p>Please make sure you've uploaded a valid syllabus file and try again.</p>
                <button 
                  onClick={() => setUploadStatus('idle')}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Why upload your syllabus?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <span className="text-red-600 mr-2">✓</span> Automatic Date Extraction
              </h3>
              <p className="text-gray-300">
                We automatically identify and extract important dates from your syllabus.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <span className="text-red-600 mr-2">✓</span> Multiple Calendar Formats
              </h3>
              <p className="text-gray-300">
                Export to Google Calendar, Outlook Calendar, or download as ICS file.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} SyllabusToCalendar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}