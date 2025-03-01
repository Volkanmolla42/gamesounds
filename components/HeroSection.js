'use client'

import Link from 'next/link'
import { Button } from './Button'
import { useState, useEffect } from 'react'
import SoundWaveAnimation from './SoundWaveAnimation'

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    // In a real app, this would check for a valid session
    // For now, we'll just check localStorage
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 ">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text animate-gradient">
          AI Sound Effects Generator
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
          Create custom sound effects for your games, videos, and applications in seconds with our AI-powered tool.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/playground">
            <Button variant="primary" size="xl" className="group text-2xl px-3 py-2 cursor-pointer">
              Try it now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
          {!isLoggedIn && (
            <Link href="/signup">
              <Button variant="outline" size="xl" className="text-2xl px-3 py-2">
                Sign up free
              </Button>
            </Link>
          )}
        </div>
        
        <SoundWaveAnimation />
      </div>
    </section>
  )
}
