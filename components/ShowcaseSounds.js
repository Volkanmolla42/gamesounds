'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { Button } from './Button';

export default function ShowcaseSounds() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  const showcaseSounds = [
    {
      title: "Sci-Fi Laser Blast",
      description: "Futuristic laser weapon sound effect",
      duration: "4",
      category: "Sci-Fi",
      image: "/images/laser.jpg",
      audioFile: "/soundfx_1740835308165.mp3"
    },
    {
      title: "Thunder Storm",
      description: "Powerful thunder and lightning sound",
      duration: "7s",
      category: "Nature",
      image: "/images/thunder.jpg",
      audioFile: "/soundfx_1740835340572.mp3"
    },
    {
      title: "Magical Spell",
      description: "Fantasy spell casting sound effect",
      duration: "4s",
      category: "Fantasy",
      image: "/images/magic.jpg",
      audioFile: "/soundfx_1740835410485.mp3"
    },
    {
      title: "Footsteps on Gravel",
      description: "Realistic footsteps on gravel path",
      duration: "4s",
      category: "Foley",
      image: "/images/gravelfoots.jpg",
      audioFile: "/soundfx_1740835435052.mp3"
    }
  ];

  const playSound = (audioFile, soundId) => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    if (currentlyPlaying === soundId) {
      setCurrentlyPlaying(null);
      setAudioElement(null);
      return;
    }

    const audio = new Audio(audioFile);
    audio.addEventListener('ended', () => {
      setCurrentlyPlaying(null);
      setAudioElement(null);
    });
    
    audio.play();
    setCurrentlyPlaying(soundId);
    setAudioElement(audio);
  };

  return (
    <section className="py-16">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Sound Showcase
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {showcaseSounds.map((sound, index) => (
          <div 
            key={index} 
            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-xl h-72 group hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 card-glow"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image 
                src={sound.image} 
                alt={sound.title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={index < 2}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
            </div>
            
            {/* Category badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-700/80 text-white backdrop-blur-sm border border-purple-500/30">
                {sound.category}
              </span>
            </div>
            
            {/* Duration badge */}
            <div className="absolute top-4 right-4 z-20">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800/70 text-gray-200 backdrop-blur-sm">
                {sound.duration}
              </span>
            </div>
            
            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 p-5 z-10 transform transition-transform duration-300 group-hover:translate-y-0">
              <h3 className="text-xl font-bold mb-2 text-white text-shadow">{sound.title}</h3>
              <p className="text-gray-200 text-sm mb-4 text-shadow opacity-90">{sound.description}</p>
              
              {/* Play/Stop button */}
              <button
                onClick={() => playSound(sound.audioFile, index)}
                className={`w-full flex items-center justify-center text-sm ${
                  currentlyPlaying === index 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                } text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 transform group-hover:scale-105`}
              >
                {currentlyPlaying === index ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10v4m6-4v4" />
                    </svg>
                    Stop Playing
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 008 9.87v4.263a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Play Sample
                  </>
                )}
              </button>
            </div>
            
            {/* Hover overlay for better interaction indication */}
            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/playground">
          <Button variant="secondary" size="lg" className="group">
            Create your own sounds
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
