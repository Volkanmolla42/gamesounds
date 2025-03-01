import Link from 'next/link';
import { Button } from './Button'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    // In a real app, this would check for a valid session
    // For now, we'll just check localStorage
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);
  
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-gradient-to-r from-blue-900 to-purple-900"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to create amazing sound effects?
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Start generating custom sounds for your projects today
        </p>
        
        {isLoggedIn ? (
          <Link href="/playground">
            <Button variant="primary" size="xl" className="group py-2 px-3">
              Go to Playground
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="xl" className="group py-2 px-3">
                Sign Up Free
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="xl" className="group py-2 px-3">
                Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}
