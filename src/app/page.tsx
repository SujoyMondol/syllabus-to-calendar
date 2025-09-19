"use client";

import { useRouter } from "next/navigation";

export default function Home() {
   
  const router = useRouter();
  
  const handleConvertClick = () => {
    

    router.push('/submit');
  };

  const handleFeatruresClick = () => {
    router.push('/features');
  }

  const handleHowItWorksClick = () => {
    router.push('/howItWorks');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">SyllabusTo<span className="text-red-600">Calendar</span></h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors" onClick={handleFeatruresClick}>Features</button>
          <button className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors" onClick={handleHowItWorksClick}>How It Works</button>
          
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors" onClick={handleConvertClick}>
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h2 className="text-5xl font-bold mb-6">
          Transform Your Syllabus Into<br />A <span className="text-red-600">Perfect Calendar</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
          Upload your course syllabus and instantly generate a downloadable calendar file with all your important dates and deadlines.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
           onClick={handleConvertClick}
          className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
            Convert Your Syllabus Now
          </button>

        </div>

        <div className="mt-16 p-6 bg-white rounded-lg shadow-xl">
          <div className="text-black text-center mb-4">
            <p className="text-sm uppercase tracking-wide font-semibold">Example Conversion</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 p-4 bg-gray-100 rounded">
              <h3 className="text-black font-bold mb-2">Syllabus Input</h3>
              <div className="text-black text-sm space-y-2">
                <p>Week 1: Introduction - Jan 10</p>
                <p>Week 2: Research Methods - Jan 17</p>
                <p>Assignment 1 Due - Jan 24</p>
                <p>Midterm Exam - Feb 14</p>
                <p>Final Project Due - Mar 15</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white font-bold">→</span>
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-100 rounded">
              <h3 className="text-black font-bold mb-2">Calendar Output</h3>
              <div className="text-black text-sm space-y-2">
                <p>📅 Introduction Class - Jan 10</p>
                <p>📅 Research Methods - Jan 17</p>
                <p>📝 Assignment 1 Due - Jan 24</p>
                <p>🖊️ Midterm Exam - Feb 14</p>
                <p>📘 Final Project Due - Mar 15</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 text-black">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">Why Choose SyllabusToCalendar?</h3>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Our tool saves time and ensures you never miss important academic deadlines again.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Extract Key Dates Automatically</h4>
              <p className="text-gray-600">Our AI identifies deadlines, exams, and important events from any syllabus format.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Multiple Calendar Formats</h4>
              <p className="text-gray-600">Export to Google Calendar, Outlook Calendar, or download as ICS file.</p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Save Hours of Manual Entry</h4>
              <p className="text-gray-600">What takes 30+ minutes manually is done in seconds with our converter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-16">How It Works</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Upload Syllabus</h4>
              <p className="text-gray-300">Upload your syllabus document in PDF, Word, or image format</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Review & Customize</h4>
              <p className="text-gray-300">Verify extracted dates and customize event details</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="font-bold text-lg mb-2">Export to Calendar</h4>
              <p className="text-gray-300">Download or sync with your preferred calendar application</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 text-black">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Organize Your Semester?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of students who use SyllabusConverter to stay on top of their academic schedule.</p>
          <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors" onClick={handleConvertClick}>
            Get Started For Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-xl font-bold">SyllabusTo<span className="text-red-600">Calendar</span></h1>
              <p className="text-gray-400 text-sm mt-2">Never miss a deadline again</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>&copy; {new Date().getFullYear()} SyllabusToCalendar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}