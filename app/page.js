'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Link from 'next/link'
import { Button } from '../components/Button'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  const { user } = useAuth()

  // Sample features list
  const features = [
    {
      title: 'AI-Powered Sound Generation',
      description: 'Create unique sound effects instantly with our advanced AI technology',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Custom Durations',
      description: 'Adjust the length of your sound effects to match your exact needs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Download & Share',
      description: 'Easily download and share your generated sounds for any project',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    },
    {
      title: 'Sound History',
      description: 'Keep track of your previously generated sounds for quick access',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  // Sample use cases
  const useCases = [
    {
      title: 'Game Development',
      description: 'Perfect for indie game developers who need custom sound effects',
      icon: '🎮'
    },
    {
      title: 'Video Production',
      description: 'Enhance your videos with unique, high-quality sound effects',
      icon: '🎬'
    },
    {
      title: 'Podcasting',
      description: 'Add immersive sound effects to your podcasts',
      icon: '🎙️'
    },
    {
      title: 'Mobile Apps',
      description: 'Create custom notification and interaction sounds',
      icon: '📱'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          }
        }}
      />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            AI Sound Effects Generator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Create custom sound effects for your games, videos, and applications in seconds with our AI-powered tool.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/playground">
              <Button variant="primary" size="xl">
                Try it now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
            {!user && (
              <Link href="/signup">
                <Button variant="outline" size="xl">
                  Sign up free
                </Button>
              </Link>
            )}
          </div>
          
          {/* Demo Sound Wave Animation */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-gray-800 bg-opacity-60 rounded-2xl p-6 shadow-xl backdrop-blur-sm backdrop-filter border border-gray-700">
              <div className="flex justify-center items-center h-20 gap-1">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
                    style={{
                      height: `${Math.sin(i / 3) * 40 + 40}%`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: `${800 + Math.random() * 400}ms`
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/playground" className="inline-flex items-center text-purple-400 hover:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start creating sounds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-800 bg-opacity-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Why Choose Our AI Sound Generator?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <div className="text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Perfect For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div 
                key={index} 
                className="bg-gray-800 bg-opacity-60 rounded-xl p-6 shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                <p className="text-gray-300">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create amazing sound effects?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start generating custom sounds for your projects today
          </p>
          
          <Link href="/playground">
            <Button variant="primary" size="xl">
              Go to Playground
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
