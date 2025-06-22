'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Loader, Info, Volume2, MessageCircle, User, BarChart3 } from 'lucide-react'
import { AuroraBackground } from '@/components/AuroraBackground'
import MeaningIridescence from '@/components/MeaningIridescence'
import Navigation from '@/components/Navigation'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: number
}

// Dynamic Terence McKenna opening messages
const TERENCE_OPENINGS = [
  "I submit to you that the real secret of magic is that the world is made of words... Speak yours, and let us explore what ineffable territories they might reveal.",
  "Language is the most recent and the most experimental of human technologies. Share your thoughts with me, and we'll discover what consciousness patterns emerge from the void.",
  "The fact of the matter is that reality is stranger than we can suppose. Tell me what's on your mind, and together we'll excavate the meaning beneath.",
  "Nature loves courage, my friend. Speak what arises in your awareness, and let's see what novel territories of understanding we might venture into.",
  "The universe is not only queerer than we suppose, but queerer than we can suppose. Share your thoughts, and we'll push the boundaries of linguistic possibility.",
  "I always think of language as a kind of technology for the downloading of experience. What experience shall we download together today?",
  "The curious business of being human involves navigating between the known and the unknowable. Speak, and let's chart some unexplored waters of meaning.",
  "Culture is not your friend - but conversation certainly is. Tell me what's stirring in your consciousness, and we'll see what emerges.",
  "The syntactical nature of reality suggests that speaking creates worlds. What world shall we create through your words today?",
  "Consciousness is the great mystery, and language is our primary tool for approaching it. Share your thoughts, and let's see what we might discover together."
]

export default function VoiceMeaningPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiInterpretation, setAiInterpretation] = useState('')
  const [meaningData, setMeaningData] = useState<any>(null)
  const [error, setError] = useState('')
  
  // Chat functionality
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTerrenceTyping, setIsTerrenceTyping] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  // Dynamic opening message
  const [currentOpening, setCurrentOpening] = useState('')
  
  // Analysis view toggle
  const [showAnalysis, setShowAnalysis] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const lastSentTextRef = useRef<string>('')

  // Initialize with random Terence opening message
  useEffect(() => {
    const randomOpening = TERENCE_OPENINGS[Math.floor(Math.random() * TERENCE_OPENINGS.length)]
    setCurrentOpening(randomOpening)
    
    // Rotate the message every 15 seconds when not recording
    const interval = setInterval(() => {
      if (!isRecording && !showChat) {
        const newOpening = TERENCE_OPENINGS[Math.floor(Math.random() * TERENCE_OPENINGS.length)]
        setCurrentOpening(newOpening)
      }
    }, 15000) // 15 seconds
    
    return () => clearInterval(interval)
  }, [isRecording, showChat])

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  // Send message to Terence McKenna
  const sendToTerence = async (message: string) => {
    if (!message.trim() || message === lastSentTextRef.current) return
    
    lastSentTextRef.current = message
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: Date.now()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setIsTerrenceTyping(true)
    setShowChat(true)
    
    try {
      const response = await fetch('/api/chat-terence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add Terence's response to chat
        const terrenceMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: Date.now()
        }
        
        setChatMessages(prev => [...prev, terrenceMessage])
      } else {
        console.error('Failed to get Terence response')
      }
    } catch (error) {
      console.error('Error sending message to Terence:', error)
    } finally {
      setIsTerrenceTyping(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // Start speech recognition for real-time AI interpretation
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition
        
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = async (event: any) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          // Update transcript display with both final and interim results
          const currentTranscript = finalTranscript || interimTranscript
          if (currentTranscript.trim()) {
            console.log('Speech Recognition Result:', { finalTranscript, interimTranscript, currentTranscript })
            setTranscript(currentTranscript)
            
            // Send to AI for real-time interpretation (only for final results)
            if (finalTranscript.trim()) {
              console.log('Sending to AI for interpretation:', finalTranscript)
              await interpretSpeech(finalTranscript)
              
              // Send to Terence for commentary (with some filtering to avoid spam)
              if (finalTranscript.trim().length > 10) {
                await sendToTerence(finalTranscript.trim())
              }
            }
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech Recognition Error:', event.error)
          setError(`Speech recognition error: ${event.error}`)
        }

        recognition.onend = () => {
          console.log('Speech recognition ended')
        }

        recognition.start()
      }

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError('')
    } catch (err) {
      setError('Failed to start recording')
      console.error('Recording error:', err)
    }
  }

  const interpretSpeech = async (speechText: string) => {
    try {
      console.log('Interpreting speech:', speechText)
      const response = await fetch('/api/interpret-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          speech_text: speechText,
          interpretation_mode: 'interpretation' // Updated to match backend schema
        })
      })

      console.log('API Response Status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('AI Interpretation Response:', data)
        setAiInterpretation(data.interpretation)
        
        // Update silk visualization with interpretation data
        if (data.meaning_data) {
          setMeaningData(data.meaning_data)
        }
      } else {
        const errorData = await response.json()
        console.error('Backend interpretation failed:', errorData)
        setError(`AI interpretation failed: ${response.status}`)
      }
    } catch (err) {
      console.error('Interpretation error:', err)
      setError(`Network error: ${err}`)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    
    setIsRecording(false)
  }

  const processMeaning = async (text: string) => {
    try {
      const response = await fetch('/api/extract-meaning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process meaning')
      }

      const data = await response.json()
      setMeaningData(data)
    } catch (error) {
      console.error('Error processing meaning:', error)
      setError(error instanceof Error ? error.message : 'Failed to process meaning')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearSession = () => {
    setTranscript('')
    setMeaningData(null)
    setError('')
    setIsRecording(false)
    setIsProcessing(false)
    setChatMessages([])
    setShowChat(false)
    setShowAnalysis(false)
    lastSentTextRef.current = ''
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    // Get a new opening message when clearing
    const newOpening = TERENCE_OPENINGS[Math.floor(Math.random() * TERENCE_OPENINGS.length)]
    setCurrentOpening(newOpening)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora background layer */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground>
          <div />
        </AuroraBackground>
      </div>

      {/* Main content layer */}
      <div className="relative z-30 min-h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-4xl">
            
            {/* MAIN CONVERSATIONAL INTERFACE - Always visible */}
            <div className="flex flex-col items-center space-y-6">
              {/* Morphing Silk Microphone Button */}
              <div className="relative w-32 h-32">
                {/* MeaningIridescence as button background */}
                {(isRecording || meaningData || showChat) && (
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <MeaningIridescence
                      meaningData={{
                        INEFFABLE_QUALITY: meaningData?.meaning_extraction?.ineffable_score || (isRecording ? 0.8 : 0.4),
                        TEMPORAL_FLOW: meaningData?.meaning_extraction?.consciousness_level * 0.85 || (isRecording ? 0.7 : 0.3),
                        EMOTIONAL_SUBSTRATE: meaningData?.meaning_extraction?.meaning_depth_score * 0.9 || (isRecording ? 0.6 : 0.2),
                        RELATIONAL_DYNAMICS: Math.min(1, meaningData?.hidden_meanings?.length / 5 || 0) || (isRecording ? 0.5 : 0.3),
                        CONSCIOUSNESS_LEVEL: meaningData?.meaning_extraction?.consciousness_level || (showChat ? 0.7 : isRecording ? 0.9 : 0.3),
                        PARADOX_TENSION: meaningData?.meaning_extraction?.ineffable_score * 0.7 || (isRecording ? 0.4 : 0.2),
                        ARCHETYPAL_RESONANCE: meaningData?.meaning_extraction?.meaning_depth_score * 0.8 || (isRecording ? 0.6 : 0.3),
                        TRANSFORMATIVE_POTENTIAL: meaningData?.meaning_extraction?.ineffable_score * 0.9 || (showChat ? 0.6 : isRecording ? 0.8 : 0.3)
                      }}
                    />
                  </div>
                )}
                
                {/* Microphone Button */}
                <motion.button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`
                    absolute inset-0 w-full h-full rounded-full flex items-center justify-center text-white text-4xl transition-all duration-300
                    ${isRecording 
                      ? 'border-2 border-red-400/30 shadow-lg shadow-red-500/20' 
                      : 'border-2 border-white/20 hover:border-white/40'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? (
                    <Loader className="animate-spin" />
                  ) : isRecording ? (
                    <Square className="fill-current" />
                  ) : (
                    <Mic />
                  )}
                </motion.button>
              </div>

              <div className="text-center space-y-2">
                {/* Dynamic Terence Opening Messages */}
                {!showChat && (
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={currentOpening}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-white/90 text-lg max-w-3xl leading-relaxed italic px-4"
                    >
                      {isRecording ? 'Excellent... I can hear your thoughts taking shape. Please, continue...' : currentOpening}
                    </motion.p>
                  </AnimatePresence>
                )}
                
                {/* Real-time transcript preview */}
                {isRecording && transcript && (
                  <motion.div 
                    className="max-w-2xl mx-4 mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white/70 text-base leading-relaxed">
                      "{transcript}"
                    </p>
                  </motion.div>
                )}
              </div>
              
              {/* Dynamic Terence Chat Bubble - ALWAYS STAYS VISIBLE */}
              <AnimatePresence>
                {showChat && chatMessages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="w-full max-w-2xl max-h-80 overflow-y-auto bg-black/40 backdrop-blur-sm border border-white/20 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-purple-400" />
                        <h3 className="text-white font-medium">The Good Bard</h3>
                      </div>
                      
                      {/* Analysis toggle button */}
                      {meaningData && (
                        <button
                          onClick={() => setShowAnalysis(!showAnalysis)}
                          className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" />
                          {showAnalysis ? 'Hide' : 'Show'} Analysis
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Avatar */}
                          {!message.isUser && (
                            <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-purple-300 font-bold">B</span>
                            </div>
                          )}
                          
                          {/* Message bubble */}
                          <div className={`max-w-[80%] rounded-xl p-3 ${
                            message.isUser 
                              ? 'bg-blue-600/30 text-blue-100' 
                              : 'bg-purple-600/20 text-purple-100 border border-purple-400/30'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                          
                          {/* User avatar */}
                          {message.isUser && (
                            <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-blue-300" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTerrenceTyping && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3 justify-start"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-purple-300 font-bold">B</span>
                          </div>
                          <div className="bg-purple-600/20 rounded-xl p-3 border border-purple-400/30">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Action buttons */}
              {(transcript || chatMessages.length > 0) && (
                <div className="flex gap-3">
                  <button
                    onClick={clearSession}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                  >
                    New Conversation
                  </button>
                  
                  {meaningData && (
                    <button
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="bg-purple-600/30 hover:bg-purple-600/50 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      {showAnalysis ? 'Hide' : 'View'} Analysis
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* OPTIONAL ANALYSIS VIEW - Toggleable */}
            <AnimatePresence>
              {showAnalysis && meaningData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-2xl space-y-4"
                >
                  {/* Meaning Dimensions */}
                  <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-purple-400" />
                      Meaning Dimensions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">Ineffable Quality</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                                style={{ width: `${(meaningData.meaning_extraction?.ineffable_score || 0) * 100}%` }}
                              />
                            </div>
                            <span className="text-white/90 text-sm font-medium">
                              {Math.round((meaningData.meaning_extraction?.ineffable_score || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-blue-300">Consciousness Level</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                                style={{ width: `${(meaningData.meaning_extraction?.consciousness_level || 0) * 100}%` }}
                              />
                            </div>
                            <span className="text-white/90 text-sm font-medium">
                              {Math.round((meaningData.meaning_extraction?.consciousness_level || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-orange-300">Paradox Tension</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 to-red-400"
                                style={{ width: `${(meaningData.meaning_extraction?.paradox_tension || 0) * 100}%` }}
                              />
                            </div>
                            <span className="text-white/90 text-sm font-medium">
                              {Math.round((meaningData.meaning_extraction?.paradox_tension || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-white/10 rounded-lg p-3">
                          <span className="text-green-300 text-sm font-medium">Emotional Substrate:</span>
                          <p className="text-white/90 text-sm mt-1">{meaningData.meaning_extraction?.emotional_substrate}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <span className="text-pink-300 text-sm font-medium">Temporal Flow:</span>
                          <p className="text-white/90 text-sm mt-1">{meaningData.meaning_extraction?.temporal_flow}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <span className="text-yellow-300 text-sm font-medium">Archetypal Resonance:</span>
                          <p className="text-white/90 text-sm mt-1">{meaningData.meaning_extraction?.archetypal_resonance}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Primitives */}
                  <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                    <h3 className="text-white text-xl font-semibold mb-4">Visual Translation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {meaningData.visual_composition?.active_primitives?.map((primitive: any, index: number) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                          <h4 className="text-blue-400 font-medium mb-1">{primitive.name}</h4>
                          <p className="text-white/80 text-sm mb-2">{primitive.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-xs">Resonance</span>
                            <span className="text-white/90 text-sm font-medium">
                              {Math.round((primitive.resonance_score || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error display */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4 max-w-2xl">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 