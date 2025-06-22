'use client'

import { motion } from 'framer-motion'
import { Mic, Camera, MapPin } from 'lucide-react'
import Link from 'next/link'
import MeaningIridescence from '@/components/MeaningIridescence'
import OctopusField from '@/components/OctopusField'
import McKennaQuotes from '@/components/McKennaQuotes'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

// Living consciousness states that respond to user interaction
const consciousnessStates = {
  awakening: {
    TEMPORAL_FLOW: 0.3,
    INEFFABLE_QUALITY: 0.6,
    EMOTIONAL_SUBSTRATE: 0.4,
    RELATIONAL_DYNAMICS: 0.2,
    CONSCIOUSNESS_LEVEL: 0.5,
    PARADOX_TENSION: 0.1,
    ARCHETYPAL_RESONANCE: 0.3,
    TRANSFORMATIVE_POTENTIAL: 0.4
  },
  exploring: {
    TEMPORAL_FLOW: 0.7,
    INEFFABLE_QUALITY: 0.8,
    EMOTIONAL_SUBSTRATE: 0.6,
    RELATIONAL_DYNAMICS: 0.5,
    CONSCIOUSNESS_LEVEL: 0.8,
    PARADOX_TENSION: 0.3,
    ARCHETYPAL_RESONANCE: 0.6,
    TRANSFORMATIVE_POTENTIAL: 0.7
  },
  transcending: {
    TEMPORAL_FLOW: 0.95,
    INEFFABLE_QUALITY: 1.0,
    EMOTIONAL_SUBSTRATE: 0.8,
    RELATIONAL_DYNAMICS: 0.9,
    CONSCIOUSNESS_LEVEL: 1.0,
    PARADOX_TENSION: 0.4,
    ARCHETYPAL_RESONANCE: 0.95,
    TRANSFORMATIVE_POTENTIAL: 0.9
  }
}

// McKenna wisdom that appears based on consciousness level
const mckennaWisdom = [
  {
    minLevel: 0.3,
    quote: "The real secret of magic is that the world is made of words, and that if you know the words that the world is made of, you can make of it whatever you wish.",
    context: "awakening"
  },
  {
    minLevel: 0.6,
    quote: "We are like coral animals embedded in a technological reef of extruded psychic objects.",
    context: "exploring"  
  },
  {
    minLevel: 0.8,
    quote: "The octopus does not just display its emotions, it becomes its meanings.",
    context: "transcending"
  }
]

export default function Home() {
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.3)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  const interactionCount = useRef(0)
  const mousePosition = useRef({ x: 0.5, y: 0.5 })
  const lastUpdateTime = useRef(Date.now())

  // Memoized consciousness state based on level
  const currentState = useMemo(() => {
    if (consciousnessLevel < 0.5) return consciousnessStates.awakening
    if (consciousnessLevel < 0.8) return consciousnessStates.exploring
    return consciousnessStates.transcending
  }, [consciousnessLevel])

  // Memoized McKenna wisdom
  const currentWisdom = useMemo(() => {
    return mckennaWisdom
      .filter(w => consciousnessLevel >= w.minLevel)
      .pop() || mckennaWisdom[0]
  }, [consciousnessLevel])

  // Derived state flags
  const showExploring = consciousnessLevel >= 0.5
  const showTranscending = consciousnessLevel >= 0.8

  // Set dimensions after mount to prevent hydration errors
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updateDimensions()
    setIsLoaded(true)
    
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Throttled consciousness evolution 
  useEffect(() => {
    const updateConsciousness = () => {
      const now = Date.now()
      // Only update if enough time has passed (reduce flashing)
      if (now - lastUpdateTime.current < 1000) return
      
      const interactions = interactionCount.current
      let newLevel = Math.min(0.3 + (interactions * 0.02), 1.0)
      
      // Add mouse-based consciousness enhancement (very subtle)
      const mouseInfluence = Math.abs(mousePosition.current.x - 0.5) + Math.abs(mousePosition.current.y - 0.5)
      newLevel = Math.min(newLevel + mouseInfluence * 0.02, 1.0)
      
      // Only update if change is significant (reduce unnecessary re-renders)
      if (Math.abs(newLevel - consciousnessLevel) > 0.05) {
        setConsciousnessLevel(newLevel)
        lastUpdateTime.current = now
      }
    }
    
    const interval = setInterval(updateConsciousness, 1000) // Slower updates
    return () => clearInterval(interval)
  }, [consciousnessLevel])

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX / rect.width
    const y = e.clientY / rect.height
    
    // Update ref directly to avoid state updates on every mouse move
    mousePosition.current = { x, y }
    interactionCount.current += 0.005 // Much more subtle
  }, [])

  // Click/interaction boosts consciousness  
  const handleInteraction = useCallback(() => {
    interactionCount.current += 0.3 // Reduced boost
  }, [])

  // Voice activation portal
  const activateVoice = useCallback(() => {
    setIsVoiceActive(true)
    interactionCount.current += 0.3
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50">Loading consciousness field...</div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleInteraction}
    >
      {/* Full-Screen Living Consciousness Field */}
      <div className="absolute inset-0 z-0">
        <MeaningIridescence
          meaningData={currentState}
          isAnalyzing={isVoiceActive}
          width={dimensions.width}
          height={dimensions.height}
        />
        {/* Black masking layer to tone down brightness */}
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Living Text Overlays - respond to consciousness level */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* McKenna Quotes with TrueFocus Effect - Always visible */}
        <McKennaQuotes />

        {/* Exploring State - Portal revelation */}
        {showExploring && (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 consciousness-gradient bg-clip-text text-transparent">
              The Field Awakens
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              You are touching McKenna's octopus skin - where meaning becomes form, where consciousness flows as color.
            </p>
            
            {/* Consciousness Portals */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
            >
              <button 
                onClick={activateVoice}
                className="px-6 py-3 glass-morphism rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <Mic className="w-5 h-5" />
                Speak Your Meaning
              </button>
              <Link 
                href="/camera"
                className="px-6 py-3 glass-morphism rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <Camera className="w-5 h-5" />
                Vision Portal
              </Link>
              <Link 
                href="/environment"
                className="px-6 py-3 glass-morphism rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center"
              >
                <MapPin className="w-5 h-5" />
                Space Reader
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Transcending State - McKenna wisdom */}
        {showTranscending && (
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
          >
            <motion.blockquote 
              className="text-2xl md:text-3xl font-medium text-white/90 mb-8 italic leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 2 }}
            >
              "{currentWisdom.quote}"
            </motion.blockquote>
            <motion.div 
              className="text-lg text-purple-300 font-medium mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 2.5 }}
            >
              — Terence McKenna
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 3 }}
              className="text-lg text-white/70"
            >
              You have become part of the octopus skin. The field remembers you.
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
