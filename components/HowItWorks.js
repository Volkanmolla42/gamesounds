import Link from "next/link";
import { Button } from "./Button";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Describe Your Sound",
      description: "Enter a detailed description of the sound effect you want to create. Be specific about tone, style, and context.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      step: 2,
      title: "Customize Parameters",
      description: "Adjust duration, pitch, and other parameters to fine-tune your sound effect exactly how you want it.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      step: 3,
      title: "Generate & Download",
      description: "Our AI will generate your sound effect in seconds. Preview, download, and use it in your projects.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          How It Works
        </h2>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ step, title, description, icon }) => (
              <div key={step} className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-gray-300">{description}</p>
                <div className="mt-4 text-purple-400">
                  {icon}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 text-center">
              <Link href="/playground">
                <Button variant="secondary" size="lg" className="group">
                  Try it yourself
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
            </div>
      </div>
    </section>
  );
}
