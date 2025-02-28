'use client'

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Button } from '../../components/Button'
import Link from 'next/link'

export default function Profile() {
  const { user, credits, subscription, signOut, upgradeToPremium } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  // If the user is not logged in, redirect to login page
  if (!user) {
    router.push('/login')
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
      toast.success('Successfully signed out')
    } catch (error) {
      toast.error('Error signing out')
      console.error('Sign out error:', error)
    }
  }

  const handleUpgrade = async () => {
    try {
      setUpgradeLoading(true)
      await upgradeToPremium()
      toast.success('Premium account activated!')
    } catch (error) {
      toast.error('Error during upgrade')
      console.error('Upgrade error:', error)
    } finally {
      setUpgradeLoading(false)
    }
  }

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
      
      <main className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <div className="bg-gray-800 bg-opacity-60 rounded-2xl p-8 shadow-xl backdrop-blur-sm backdrop-filter border border-gray-700">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profil Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{user.email.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            
            {/* Kullanıcı Bilgileri */}
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">User Profile</h1>
                <p className="text-gray-300 mt-2">View your account details and usage statistics.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-4">
                  <h2 className="text-sm uppercase text-gray-400 mb-2">Email</h2>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div className="border-b border-gray-700 pb-4">
                  <h2 className="text-sm uppercase text-gray-400 mb-2">Membership Status</h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${subscription === 'premium' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                    <p className="text-lg">{subscription === 'premium' ? 'Premium' : 'Free'}</p>
                  </div>
                </div>
                
                <div className="pb-4">
                  <h2 className="text-sm uppercase text-gray-400 mb-2">Remaining Credits</h2>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-bold">{credits}</p>
                    <div className="text-sm text-gray-400">
                      Free accounts have 10 credits, premium accounts have 100 credits.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="mt-8 space-y-4">
            {subscription !== 'premium' && (
              <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6 border border-purple-500/30">
                <h3 className="text-xl font-bold">Upgrade to Premium</h3>
                <p className="text-gray-300 mt-2 mb-4">
                  Get more credits and features with a premium account.
                </p>
                <Button 
                  variant="primary" 
                  onClick={handleUpgrade}
                  isLoading={upgradeLoading}
                >
                  Upgrade Now
                </Button>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                isLoading={loading}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
