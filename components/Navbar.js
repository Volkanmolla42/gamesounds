'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, credits, subscription, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Listen for scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSignOut = async () => {
    await signOut()
    closeMenu()
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                SoundFX
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/playground" 
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === '/playground' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Playground
              </Link>
              <Link 
                href="/pricing" 
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === '/pricing' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Pricing
              </Link>
              <Link 
                href="/showcase" 
                className={`px-3 py-2 text-sm font-medium ${
                  pathname === '/showcase' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-purple-300'
                }`}
              >
                Examples
              </Link>
            </div>
          </div>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                  <div className={`w-2 h-2 rounded-full ${subscription === 'premium' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  <span className="font-medium">{credits} credits</span>
                </div>
                <Link 
                  href="/profile" 
                  className={`text-sm font-medium px-3 py-2 rounded-md ${
                    pathname === '/profile' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 cursor-pointer hover:text-white px-3 py-2 text-sm font-medium">
                  Log In
                </Link>
                <Link href="/signup">
                  <button className="bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMenu}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-gray-900 border-t border-gray-800`}
      >
        <div className="pt-2 pb-4 space-y-1 px-3">
          <Link 
            href="/"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/playground"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/playground' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Playground
          </Link>
          <Link 
            href="/pricing"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/pricing' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/showcase"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/showcase' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Examples
          </Link>
          
          {user ? (
            <>
              <div className="flex items-center px-3 py-2 space-x-2">
                <div className={`w-2 h-2 rounded-full ${subscription === 'premium' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                <span className="text-sm text-gray-300 font-medium">{credits} credits</span>
              </div>
              <Link 
                href="/profile"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/profile' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Log In
              </Link>
              <Link 
                href="/signup"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
