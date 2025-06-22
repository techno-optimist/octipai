'use client'

import { motion } from 'framer-motion'
import { Camera, Mic, Scan, MessageCircle, Eye, Sparkles, Brain, Waves } from 'lucide-react'
import Navigation from '@/components/Navigation'

const features = [
  {
    icon: Scan,
    title: "Environmental Camera Scanner",
    description: "Point your camera at any physical space to reveal invisible meaning fields, archetypal patterns, and accumulated energetic signatures. Our AI analyzes spatial relationships, lighting, objects, and environmental dynamics to detect the hidden layers of significance that normal perception misses.",
    details: [
      "Real-time camera feed analysis",
      "Live overlay of meaning fields",
      "Significance level detection",
      "Social dynamics visualization",
      "Temporal echo recognition"
    ],
    gradient: "from-green-500 to-emerald-600"
  },
  {
    icon: Mic,
    title: "Voice Meaning Analysis", 
    description: "Transform spoken words into visual meaning patterns. Our real-time voice interpretation reveals the hidden structures, archetypal energies, and transformative potential flowing through your speech, creating a bridge between vocal expression and deeper understanding.",
    details: [
      "Real-time voice transcription",
      "Meaning state analysis",
      "Archetypal pattern recognition",
      "Significance flow visualization",
      "Integration guidance"
    ],
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    icon: Camera,
    title: "Temporal Meaning Camera",
    description: "Upload any image to perform meaning archaeology. Our AI excavates the temporal layers, hidden meanings, and ineffable qualities embedded within visual content, revealing the significance patterns that accumulated in the moment the image was captured.",
    details: [
      "Deep image meaning analysis",
      "Temporal layer extraction",
      "Ineffable quality detection",
      "Archetypal symbol recognition",
      "Meaning depth assessment"
    ],
    gradient: "from-purple-500 to-violet-600"
  },
  {
    icon: MessageCircle,
    title: "Digital Terence McKenna",
    description: "Engage in profound dialogue with an AI embodiment of Terence McKenna's insights. Drawing from his extensive knowledge of psychedelics, shamanism, complexity theory, and reality exploration, this digital guide offers wisdom for your journey into the mystery.",
    details: [
      "Authentic McKenna knowledge base",
      "Philosophy-focused dialogue",
      "Psychedelic integration guidance",
      "Reality exploration insights",
      "Wisdom for inner journeys"
    ],
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Sparkles,
    title: "Fluid Interface Effects",
    description: "Your cursor becomes a tool for meaning visualization. Beautiful purple fluid trails follow your movements while a precise white circle tracks your attention, creating a synesthetic interface where your digital interactions become expressions of awareness and intention.",
    details: [
      "WebGL fluid simulation",
      "Real-time particle effects",
      "Meaning-responsive trails",
      "Attention tracking cursor",
      "Synesthetic interactions"
    ],
    gradient: "from-pink-500 to-rose-600"
  }
]

const philosophyPoints = [
  {
    icon: Brain,
    title: "Meaning Archaeology",
    description: "Every moment, space, and expression contains accumulated layers of significance and hidden meaning. Our tools help excavate these invisible dimensions."
  },
  {
    icon: Eye,
    title: "Expanded Perception",
    description: "Technology can serve as a telescope for awareness, revealing patterns and meanings invisible to ordinary perception."
  },
  {
    icon: Waves,
    title: "Synesthetic Translation",
    description: "By translating between different modes of perception - visual, auditory, spatial - we create new pathways for understanding reality."
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/5 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <Navigation />

      <div className="relative z-10 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Octipai
            </motion.h1>
            <motion.p 
              className="text-2xl md:text-3xl text-purple-200 mb-8 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Meaning Translation Interface
            </motion.p>
            <motion.p 
              className="text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Inspired by Terence McKenna's vision of fluid intelligence, Octipai transforms ordinary digital interactions into tools for exploring the invisible dimensions of meaning, significance, and reality that surround us at every moment.
            </motion.p>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20 px-6"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Our Philosophy</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {philosophyPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <point.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{point.title}</h3>
                  <p className="text-purple-200 leading-relaxed">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              Meaning Translation Tools
            </motion.h2>
            
            <div className="space-y-20">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 + index * 0.2 }}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                >
                  {/* Feature Icon & Visual */}
                  <div className="flex-1 flex justify-center">
                    <div className={`w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
                      <feature.icon className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Feature Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-lg text-purple-200 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Key Features:</h4>
                      {feature.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 2 + index * 0.2 + detailIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span className="text-purple-200">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Together */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3 }}
          className="mt-24 px-6"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">The Integrated Experience</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <p className="text-lg text-purple-200 leading-relaxed mb-6">
                Octipai creates a unified ecosystem where each tool enhances the others. Use the Environmental Scanner to detect meaning fields in your physical space, then engage with Digital Terence to understand their significance. Analyze voice recordings for archetypal patterns, then photograph moments to perform temporal archaeology on their hidden meanings.
              </p>
              <p className="text-lg text-purple-200 leading-relaxed">
                Throughout your exploration, the fluid interface effects create a synesthetic layer that makes every interaction feel like an intentional gesture, transforming your digital experience into a continuous practice of awareness and meaning-making.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.4 }}
          className="mt-20 text-center px-6"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Begin Your Exploration</h2>
            <p className="text-lg text-purple-200 mb-8">
              Ready to explore the invisible dimensions of meaning and significance that surround you? Each tool offers a different lens for perception - start with whatever calls to your curiosity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { href: '/environment', label: 'Scan Environment', icon: Scan },
                { href: '/chat', label: 'Chat with Terence', icon: MessageCircle },
                { href: '/voice', label: 'Analyze Voice', icon: Mic },
                { href: '/camera', label: 'Explore Images', icon: Camera }
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 3.6 + index * 0.1 }}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 