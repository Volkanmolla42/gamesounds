'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Ahmed Wilson",
      role: "Game Developer",
      content: "This tool has allowed me to create all the sound effects I need for my games. I no longer need to hire a sound designer!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      name: "Sarah Johnson",
      role: "Podcast Producer",
      content: "Creating custom sound effects for my podcasts has never been easier. My listeners can definitely feel the difference.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      name: "Michael Smith",
      role: "Video Content Creator",
      content: "Creating custom sound effects for my YouTube videos has taken my content to the next level. It's super easy to use and the results are amazing!",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            What Our Users Say
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`bg-gray-800 bg-opacity-60 rounded-xl p-8 shadow-lg backdrop-blur-sm backdrop-filter border border-gray-700 transition-opacity duration-500 ${
                    index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0 left-0 right-0'
                  }`}
                >
                  <div className="flex items-center mb-6">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={56} 
                      height={56} 
                      className="w-14 h-14 rounded-full mr-4 border-2 border-purple-500 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <p className="text-purple-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg italic">`{testimonial.content}`</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeTestimonial ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
