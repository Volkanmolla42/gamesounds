'use client'

import { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'
import UseCases from '@/components/UseCases'
import ShowcaseSounds from '@/components/ShowcaseSounds'
import Pricing from '@/components/Pricing'
import LatestNews from '@/components/LatestNews'
import FAQ from '@/components/FAQ'
import { Button } from '@/components/Button'
import CTA from '@/components/CTA'
import { motion } from 'framer-motion'

export default function Home() {





  // Auto-rotate testimonials


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0B1120] via-[#111827] to-[#1F2937] text-white">
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
      <main className="flex-1 space-y-24 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ShowcaseSounds/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HowItWorks/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Features/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Testimonials/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <UseCases/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Pricing/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LatestNews/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FAQ/>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CTA/>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
