'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
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
  
  // Mock user state
  const [user, setUser] = useState(null)
  const [credits, setCredits] = useState(10)
  const [subscription, setSubscription] = useState('free')
  
  // Check if user is logged in
  useEffect(() => {
    // In a real app, this would check for a valid session
    // For now, we'll just check localStorage
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setUser({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      });
      setCredits(10);
      setSubscription('free');
    } else {
      setUser(null);
    }
  }, []);
  
  // Mock credit spending function
  const spendCredit = async () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };
  
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
      // Redirect to signup page
      window.location.href = '/signup'
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
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          toast.dismiss(loadingToastId)
          toast.error('Session expired. Please login again.')
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000)
          return
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
    <div className="min-h-screen flex flex-col bg-[#0f1524] text-white">
      <Navbar />
      
      <audio ref={audioRef} src={audioUrl} className="hidden" />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#7e6bff]">
              Sound Creation Playground
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Create custom sound effects using AI. Describe the sound you want, adjust the duration, and let 
              our AI generate it instantly.
            </p>
            
            {user ? (
              <div className="mt-4 flex justify-center items-center gap-3">
                <Badge 
                  variant={subscription === 'premium' ? "destructive" : "default"}
                  className="text-sm py-1 px-3"
                >
                  {subscription === 'premium' ? 'Premium Account' : 'Free Account'}
                </Badge>
                <Badge 
                  variant="primary" 
                  className="text-sm py-1 px-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                  {credits} credits left
                </Badge>
              </div>
            ) : (
              <div className="mt-4 flex justify-center items-center gap-3">
                <Link href="/signup">
                  <Button variant="primary" className="bg-[#4c65ff] hover:bg-[#3b52e4]">
                    Sign up to generate sounds
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-[#2a3655] bg-[#1a2235] hover:bg-[#2a3655]">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </section>
          
          <Card className="mb-12 bg-[#131b2e] border-[#1e2a45] shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="border-b border-[#1e2a45]">
              <CardTitle className="text-xl text-white">Sound Description</CardTitle>
              <CardDescription className="text-gray-400">
                Describe the sound you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe the sound you want (e.g. 'Space ship engine start sound')"
                className="h-24 bg-[#1a2235] border-[#2a3655] placeholder-gray-500 text-white focus:ring-[#4c65ff] focus:border-[#4c65ff]"
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
                  className="w-full playground-slider"
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
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-[#1a2235] border-[#2a3655] hover:bg-[#2a3655] text-gray-300 px-4 py-1.5 h-auto"
                  >
                    {example.text}
                  </Button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-2 pt-2 pb-6 border-t border-[#1e2a45]">
              <Button
                onClick={generateSound}
                disabled={loading || !user}
                className={`${user ? 'bg-[#4c65ff] hover:bg-[#3b52e4]' : 'bg-gray-500 cursor-not-allowed'} text-white px-6 py-5 h-auto relative overflow-hidden group`}
              >
                <div className="flex items-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.14 5.86a9 9 0 11-12.28 12.28M19.14 5.86a9 9 0 00-12.28 12.28" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                      </svg>
                      {user ? 'Generate Sound' : 'Login to Generate Sound'}
                    </>
                  )}
                </div>
                {user && (
                  <div className="absolute -top-10 right-0 bg-[#3b52e4] px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 group-hover:-translate-y-12 opacity-0 group-hover:opacity-100">
                    {credits} credits left
                  </div>
                )}
              </Button>

              {audioUrl && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={downloadSound}
                        className="border-[#2a3655] bg-[#1a2235] hover:bg-[#2a3655] px-4 py-5 h-auto"
                      >
                        <Download className="h-5 w-5 mr-2" />
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
            <Card className="mb-12 bg-[#131b2e] border-[#1e2a45] shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="border-b border-[#1e2a45]">
                <CardTitle className="text-xl text-[#7e6bff] flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                  Audio Player
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={playPause}
                      variant="default"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-[#4c65ff] hover:bg-[#3b52e4] flex items-center justify-center"
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
                      className="w-full playground-slider"
                    />
                  </div>
                </div>
                
                <div 
                  className="h-2 w-full bg-[#1a2235] rounded-full overflow-hidden cursor-pointer" 
                  onClick={setAudioPosition}
                >
                  <div 
                    className="h-full bg-[#4c65ff]" 
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Sound History */}
          <Card className="bg-[#131b2e] border-[#1e2a45] shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#1e2a45]">
              <CardTitle className="text-xl text-[#7e6bff] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 8v4l3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Sound History
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearHistory}
                className="text-gray-400 hover:text-white hover:bg-[#1a2235]"
              >
                Clear History
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <Card 
                      key={index}
                      className="bg-[#1a2235] hover:bg-[#2a3655] transition-colors cursor-pointer border-[#2a3655] group"
                      onClick={() => replayFromHistory(item)}
                    >
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <div className="mb-2 font-medium group-hover:text-[#7e6bff] transition-colors">{item.text}</div>
                          <div className="flex items-center text-sm text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 6v6l4 2"></path>
                            </svg>
                            <span>Duration: {item.duration}s</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 text-right">
                          <div>{item.timestamp}</div>
                          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#7e6bff]">
                            Click to play
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-[#1a2235]/30 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-500">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
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