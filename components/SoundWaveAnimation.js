'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SoundWaveAnimation() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const renderWaveBars = () => {
    return [...Array(40)].map((_, i) => {
      const maxHeight = `${Math.max(30, Math.sin(i / 3) * 40 + 40)}%`;
      const delay = `${i * 30}ms`;
      const duration = `${800 + Math.floor(Math.random() * 600)}ms`;
      
      return (
        <div
          key={i}
          className="sound-wave-bar mx-px"
          style={{
            '--max-height': maxHeight,
            '--wave-delay': delay,
            '--wave-duration': duration,
          }}
        />
      );
    });
  };
  
  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <div className="bg-gray-800 bg-opacity-60 rounded-2xl p-6 shadow-xl backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="flex justify-center items-center h-20 gap-px">
          {mounted ? (
            renderWaveBars()
          ) : (
            [...Array(40)].map((_, i) => (
              <div
                key={i}
                className="mx-px bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
                style={{ 
                  width: '4px',
                  height: '20%' 
                }}
              />
            ))
          )}
        </div>
        <div className="mt-4 text-center">
          <Link href="/playground" className="inline-flex items-center text-purple-400 hover:text-purple-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start creating sounds
          </Link>
        </div>
      </div>
    </div>
  );
}
