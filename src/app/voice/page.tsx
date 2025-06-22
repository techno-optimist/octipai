'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Square, Loader, Info, Volume2 } from 'lucide-react'
import { AuroraBackground } from '@/components/AuroraBackground'
import MeaningIridescence from '@/components/MeaningIridescence'
import Navigation from '@/components/Navigation'

export default function VoiceMeaningPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiInterpretation, setAiInterpretation] = useState('')
  const [meaningData, setMeaningData] = useState<any>(null)
  const [error, setError] = useState('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

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
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
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
          <div className="flex flex-col items-center justify-center space-y-6">
            
            {/* Recording Interface - Perfectly Centered */}
            {!transcript && (
              <div className="flex flex-col items-center space-y-6">
                {/* Morphing Silk Microphone Button */}
                <div className="relative w-32 h-32">
                  {/* MeaningIridescence as button background */}
                  {(isRecording || meaningData) && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <MeaningIridescence
                        meaningData={{
                          INEFFABLE_QUALITY: meaningData?.meaning_extraction?.ineffable_score || (isRecording ? 0.8 : 0),
                          TEMPORAL_FLOW: meaningData?.meaning_extraction?.consciousness_level * 0.85 || (isRecording ? 0.7 : 0),
                          EMOTIONAL_SUBSTRATE: meaningData?.meaning_extraction?.meaning_depth_score * 0.9 || (isRecording ? 0.6 : 0),
                          RELATIONAL_DYNAMICS: Math.min(1, meaningData?.hidden_meanings?.length / 5 || 0) || (isRecording ? 0.5 : 0),
                          CONSCIOUSNESS_LEVEL: meaningData?.meaning_extraction?.consciousness_level || (isRecording ? 0.9 : 0),
                          PARADOX_TENSION: meaningData?.meaning_extraction?.ineffable_score * 0.7 || (isRecording ? 0.4 : 0),
                          ARCHETYPAL_RESONANCE: meaningData?.meaning_extraction?.meaning_depth_score * 0.8 || (isRecording ? 0.6 : 0),
                          TRANSFORMATIVE_POTENTIAL: meaningData?.meaning_extraction?.ineffable_score * 0.9 || (isRecording ? 0.8 : 0)
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Microphone Button - Completely transparent */}
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
                  <p className="text-white/90 text-lg">
                    {isRecording ? 'Recording... Click to stop' : 'Speak your thoughts and watch them transform into flowing consciousness'}
                  </p>
                  
                  {/* Real-time AI Interpretation Text */}
                  {isRecording && aiInterpretation && (
                    <motion.div 
                      className="max-w-2xl mx-4 mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-purple-300/90 text-lg leading-relaxed italic">
                        "{aiInterpretation}"
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Voice Analysis Results */}
            {(transcript || meaningData) && (
              <div className="space-y-4 w-full max-w-2xl">
                {/* Transcript with MeaningIridescence background */}
                <div className="relative bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 overflow-hidden">
                  {/* MeaningIridescence as localized background - only behind transcript */}
                  {meaningData && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <MeaningIridescence
                        meaningData={{
                          INEFFABLE_QUALITY: meaningData.meaning_extraction?.ineffable_score || 0,
                          TEMPORAL_FLOW: (meaningData.meaning_extraction?.consciousness_level || 0) * 0.85,
                          EMOTIONAL_SUBSTRATE: (meaningData.meaning_extraction?.consciousness_level || 0) * 0.9,
                          RELATIONAL_DYNAMICS: Math.min(1, meaningData.visual_composition?.active_primitives?.length / 5 || 0),
                          CONSCIOUSNESS_LEVEL: meaningData.meaning_extraction?.consciousness_level || 0,
                          PARADOX_TENSION: (meaningData.meaning_extraction?.paradox_tension || 0),
                          ARCHETYPAL_RESONANCE: (meaningData.meaning_extraction?.consciousness_level || 0) * 0.8,
                          TRANSFORMATIVE_POTENTIAL: (meaningData.meaning_extraction?.consciousness_level || 0) * 0.9,
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Floating transcript */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Volume2 className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white text-xl font-semibold">Voice Transcript</h3>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border-2 border-white/20">
                      <p className="text-white/90 text-lg leading-relaxed italic">
                        "{transcript}"
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="relative z-10 mt-6 flex gap-3">
                    {!meaningData && !isProcessing && (
                      <button
                        onClick={() => processMeaning(transcript)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Info className="w-5 h-5" />
                        Extract Meaning
                      </button>
                    )}
                    
                    {isProcessing && (
                      <div className="flex-1 p-4 bg-black/30 rounded-lg">
                        <div className="flex items-center justify-center gap-3">
                          <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                          <span className="text-white/90">Excavating meaning layers...</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={clearSession}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm transition-all duration-200"
                    >
                      New Recording
                    </button>
                  </div>
                </div>

                {/* Analysis results */}
                {meaningData && (
                  <div className="space-y-4 pb-8">
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

                    {/* Analysis Summary */}
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-green-400" />
                        Voice Translation Summary
                      </h3>
                      <div className="space-y-4 text-white/90">
                        <div>
                          <h4 className="text-purple-300 font-medium mb-2">🎤 Voice Processing</h4>
                          <p className="text-sm leading-relaxed">
                            Your voice was captured and transcribed using browser speech recognition, then analyzed through our 
                            McKenna-inspired meaning extraction system to uncover the deeper semantic and consciousness patterns 
                            within your spoken words.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-blue-300 font-medium mb-2">🌊 Meaning Visualization</h4>
                          <p className="text-sm leading-relaxed">
                            The flowing iridescent background responds to your voice's meaning signature - each pattern and color 
                            shift represents the ineffable qualities, temporal flows, and consciousness levels detected in your speech.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-pink-300 font-medium mb-2">✨ Synesthetic Translation</h4>
                          <p className="text-sm leading-relaxed">
                            This is McKenna's octopus communication in action - your words bypass linguistic reduction and become 
                            direct visual meaning, preserving the full spectrum of consciousness that language often loses.
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-white/60 italic">
                            "Language is a tool for concealing thought as much as revealing it." - The visual bypasses this limitation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error display */}
                {error && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4">
                    <p className="text-red-200">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 