'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { fetchWithTimeout, truncateText } from '../../lib/utils'

// Shadcn UI components
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../../components/ui/tooltip"
import { 
  Download, 
  Play, 
  Pause, 
  Volume2
} from "lucide-react"

export default function Playground() {
  const [text, setText] = useState('')
  const [generationDuration, setGenerationDuration] = useState(7) 
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [history, setHistory] = useState([])
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  
  const { user, credits, spendCredit, subscription } = useAuth()
  
  const examples = [
    { id: 'glass', text: 'Glass breaking sound' },
    { id: 'door', text: 'Door creaking' },
    { id: 'rain', text: 'Rain sound' },
    { id: 'wind', text: 'Wind howling' },
    { id: 'thunder', text: 'Thunder clap' },
    { id: 'cat', text: 'Cat meowing' },
    { id: 'dog', text: 'Dog barking' },
    { id: 'footsteps', text: 'Footsteps on wooden floor' }
  ]

  useEffect(() => {
    const savedHistory = localStorage.getItem('soundHistory')
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error parsing history from localStorage:', error)
        localStorage.removeItem('soundHistory')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('soundHistory', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.volume = volume
      
      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)
      const handleEnded = () => setIsPlaying(false)
      const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime)
      const handleDurationChange = () => {
        if (audioElement.duration && !isNaN(audioElement.duration)) {
          setDuration(audioElement.duration)
        }
      }
      
      audioElement.addEventListener('play', handlePlay)
      audioElement.addEventListener('pause', handlePause)
      audioElement.addEventListener('ended', handleEnded)
      audioElement.addEventListener('timeupdate', handleTimeUpdate)
      audioElement.addEventListener('durationchange', handleDurationChange)
      
      return () => {
        audioElement.removeEventListener('play', handlePlay)
        audioElement.removeEventListener('pause', handlePause)
        audioElement.removeEventListener('ended', handleEnded)
        audioElement.removeEventListener('timeupdate', handleTimeUpdate)
        audioElement.removeEventListener('durationchange', handleDurationChange)
      }
    }
  }, [volume])

  const generateSound = async () => {
    // Form validation
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }
    
    if (text.length > 500) {
      toast.error('Text is too long (maximum 500 characters)')
      return
    }
    
    if (!user) {
      toast.error('You must be logged in to generate sounds')
      return
    }
    
    if (credits <= 0) {
      toast.error('You do not have enough credits. Please upgrade to premium.')
      return
    }
    
    try {
      setLoading(true)
      const loadingToastId = toast.loading('Generating sound...')
      
      // Credit usage - check if successful
      const creditUsed = await spendCredit()
      if (!creditUsed) {
        toast.dismiss(loadingToastId)
        toast.error('Failed to use credit. Please try again.')
        setLoading(false)
        return
      }
      
      // API call to generate sound
      const response = await fetchWithTimeout('/api/generate-sound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          duration: generationDuration 
        }),
        timeout: 60000, // 60 second timeout
      })
      
      if (!response.ok) {
        let errorMessage = 'Failed to generate sound';
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      // API returns binary audio data, not JSON
      const audioBlob = await response.blob();
      
      // Clean up previous URL if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      // Create new URL from blob
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);
      
      // Add to history
      const newHistoryItem = {
        text,
        audioUrl: newAudioUrl,
        timestamp: new Date().toLocaleString(),
        duration: generationDuration
      }
      
      const updatedHistory = [newHistoryItem, ...history]
      setHistory(updatedHistory)
      
      // Save to localStorage
      localStorage.setItem('soundHistory', JSON.stringify(updatedHistory))
      
      // Auto-play the generated sound
      if (audioRef.current) {
        audioRef.current.src = newAudioUrl;
        
        // Wait for audio to be loaded before playing
        audioRef.current.onloadeddata = () => {
          const playPromise = audioRef.current.play();
          
          // Handle play promise to avoid AbortError
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
              })
              .catch(error => {
                console.error("Audio playback error:", error);
                setIsPlaying(false);
              });
          }
        };
        
        audioRef.current.load();
      }
      
      toast.dismiss(loadingToastId)
      toast.success('Sound generated successfully!')
    } catch (error) {
      console.error('Sound generation error:', error)
      
      // Handle different error types
      if (error.name === 'AbortError') {
        toast.error('Request timed out')
      } else {
        toast.error(`Failed to generate sound: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }
  
  const downloadSound = () => {
    if (audioUrl) {
      try {
        const filename = `soundfx_${Date.now()}.mp3`
        const a = document.createElement('a')
        a.href = audioUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        toast.success(`Sound downloaded: ${filename}`)
      } catch (error) {
        console.error('Download error:', error)
        toast.error('Failed to download sound')
      }
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateSound()
    }
  }

  const clearHistory = () => {
    setHistory([])
    toast.success('History cleared')
  }

  const replayFromHistory = (item) => {
    if (audioRef.current) {
      // Set the current text and URL
      setText(item.text)
      setAudioUrl(item.audioUrl)
      
      // Set the audio source
      audioRef.current.src = item.audioUrl
      audioRef.current.load()
      
      // Play after loading
      audioRef.current.onloadeddata = () => {
        const playPromise = audioRef.current.play();
        
        // Handle play promise to avoid AbortError
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error("Audio playback error:", error);
              setIsPlaying(false)
            });
        }
      }
    }
  }

  const setAudioPosition = (e) => {
    if (audioRef.current && duration > 0) {
      const pos = e.nativeEvent.offsetX / e.target.offsetWidth
      audioRef.current.currentTime = pos * duration
    }
  }
  
  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        const playPromise = audioRef.current.play();
        
        // Handle play promise to avoid AbortError
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error("Audio playback error:", error);
              setIsPlaying(false)
            });
        }
      }
    }
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <audio ref={audioRef} src={audioUrl} className="hidden" />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          
          <section className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Sound Creation Playground
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Create custom sound effects using AI. Describe the sound you want,
              adjust the duration, and let our AI generate it instantly.
            </p>
            
            {user && (
              <div className="mt-4 text-sm font-medium flex justify-center items-center gap-2">
                <Badge variant={subscription === 'premium' ? "secondary" : "default"}>
                  {subscription === 'premium' ? 'Premium Account' : 'Free Account'}
                </Badge>
                <Badge variant="outline">{credits} credits left</Badge>
              </div>
            )}
          </section>
          
          <Card className="mb-12 bg-gray-800/60 border-gray-700 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sound Description</CardTitle>
              <CardDescription>
                Describe the sound you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe the sound you want (e.g. 'Space ship engine start sound')"
                className="h-24 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                disabled={loading}
                autoCorrect='off' autoCapitalize='off' spellCheck='false'
              />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Sound Duration: {generationDuration} seconds
                  </label>
                </div>
                <Slider
                  value={[generationDuration]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(value) => setGenerationDuration(value[0])}
                  disabled={loading}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1s</span>
                  <span>5s</span>
                  <span>10s</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {examples.map((example) => (
                  <Button
                    key={example.id}
                    onClick={() => setText(example.text)}
                    variant="secondary"
                    size="sm"
                    className="rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300"
                  >
                    {example.text}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-2">
              <Button
                onClick={generateSound}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? 'Generating...' : 'Generate Sound'}
              </Button>

              {audioUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={downloadSound}
                        className="border-gray-600 bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download Sound</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardFooter>
          </Card>
          
          {audioUrl && (
            <Card className="mb-12 bg-gray-800/60 border-gray-700 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  Audio Player
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={playPause}
                      variant="default"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{truncateText(text, 40)}</div>
                      <div className="text-xs text-gray-400">Duration: {formatTime(currentTime)} / {formatTime(duration)}</div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/3 flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => setVolume(value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div 
                  className="h-2 w-full bg-gray-700 rounded-full overflow-hidden cursor-pointer" 
                  onClick={setAudioPosition}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sound History */}
          <Card className="bg-gray-800/60 border-gray-700 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Sound History
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
              >
                Clear History
              </Button>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <Card 
                      key={index}
                      className="bg-gray-700/50 hover:bg-gray-600 transition-colors cursor-pointer"
                      onClick={() => replayFromHistory(item)}
                    >
                      <CardContent className="p-4">
                        <div className="mb-2 font-medium">{item.text}</div>
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <span>Duration: {item.duration}s</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Your generated sounds will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}