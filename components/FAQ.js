'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openItem, setOpenItem] = useState(null);

  const faqs = [
    {
      question: "Is this service completely free?",
      answer: "Basic features can be used for free. However, we have premium plans available for more sound generation credits and advanced features."
    },
    {
      question: "Can I use the sounds I create in commercial projects?",
      answer: "Yes, all sounds you create belong to you and can be freely used in your commercial projects."
    },
    {
      question: "What's the sound quality like?",
      answer: "All sounds are created at 44.1kHz, 16-bit quality and are suitable for use in professional projects."
    },
    {
      question: "Can I use it on mobile devices?",
      answer: "Yes, our web application is designed to work seamlessly on all modern mobile browsers."
    },
    {
      question: "How can I download the sounds I create?",
      answer: "After each sound is generated, you can save it in WAV or MP3 format by clicking the download button."
    }
  ];

  const toggleItem = (index) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-60 rounded-xl shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center"
                onClick={() => toggleItem(index)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    openItem === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                className={`px-6 pb-4 transition-all duration-300 ${
                  openItem === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
