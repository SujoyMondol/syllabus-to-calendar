/* eslint-disable */
"use client";

import '../app/globals.css';    
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: "Upload Your Syllabus",
      description: "Start by uploading your course syllabus in PDF or DOCX format. Our system accepts most standard syllabus formats from educational institutions.",
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      step: 2,
      title: "AI-Powered Processing",
      description: "Our advanced AI algorithms analyze your syllabus to identify all important dates, assignments, exams, and events with precision.",
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      step: 3,
      title: "Review & Customize",
      description: "Preview the extracted events and make any necessary adjustments. Add custom reminders or modify event details to suit your preferences.",
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      step: 4,
      title: "Export to Calendar",
      description: "Export your organized schedule directly to Google Calendar, Outlook, Apple Calendar, or download as an ICS file for any calendar application.",
      icon: (
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    }
  ];

  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We currently support PDF and DOCX files. If you have a syllabus in another format, you can convert it to one of these formats first."
    },
    {
      question: "How accurate is the date extraction?",
      answer: "Our AI algorithms are highly accurate at identifying dates and events in syllabi. However, we always recommend reviewing the extracted events before exporting to your calendar."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We process your syllabus files securely and do not store any personal information. Your data is only used for the purpose of creating your calendar."
    },
    {
      question: "Can I edit events after processing?",
      answer: "Yes, you can review and edit all events before exporting them to your calendar. You can add custom reminders or modify event details as needed."
    },
    {
      question: "Do you support recurring events?",
      answer: "Yes, our system can detect recurring events like weekly classes and set them up as recurring events in your calendar."
    },
    {
      question: "Is there a limit to how many syllabi I can process?",
      answer: "No, you can process as many syllabi as you need. There's no limit to the number of courses you can manage with our tool."
    }
  ];

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
          <Link href="/features" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
            Features
          </Link>
          <Link href="/how-it-works" className="px-4 py-2 rounded bg-white text-black transition-colors">
            How It Works
          </Link>
          <Link href="/submit" className="px-4 py-2 rounded hover:bg-white hover:text-black transition-colors">
            Upload
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">How It Works</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transforming your syllabus into a organized calendar is simple with our four-step process. 
          Here's how to get all your important dates into your calendar in minutes.
        </p>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {steps.map((step, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
              <div className="flex-shrink-0 mr-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {step.step}
                </div>
              </div>
              <div>
                <div className="flex justify-center mb-4 md:hidden">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              <div className="hidden md:flex flex-shrink-0 ml-6">
                {step.icon}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Process Flow */}
      <section className="bg-white text-black py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Simple 4-Step Process</h2>
          
          <div className="relative hidden md:block">
            {/* Process Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>
            
            <div className="relative flex justify-between z-10">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <div className="w-32 text-sm text-gray-600">
                    {step.description.split(' ').slice(0, 10).join(' ')}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Now that you know how it works, try it for yourself. Transform your syllabus into a calendar in just a few minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/submit"
            className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Upload Your Syllabus
          </Link>
          <Link 
            href="/features"
            className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            View All Features
          </Link>
        </div>
      </section>

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