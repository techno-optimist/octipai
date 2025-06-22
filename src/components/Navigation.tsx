'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Home, Mic, Camera, Scan, MessageCircle, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Synesthetic Meaning Hub'
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageCircle,
    description: 'Digital Terence McKenna'
  },
  {
    name: 'Voice',
    href: '/voice',
    icon: Mic,
    description: 'Real-Time Voice Visualization'
  },
  {
    name: 'Camera',
    href: '/camera',
    icon: Camera,
    description: 'Temporal Meaning Archaeology'
  },
  {
    name: 'Environment',
    href: '/environment',
    icon: Scan,
    description: 'Spatial Consciousness Scanner'
  }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Main Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-purple-400/30 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 w-80 bg-black/80 backdrop-blur-md rounded-2xl border border-purple-400/30 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(147, 51, 234, 0.2)'
            }}
          >
            <div className="p-4">
              <div className="text-purple-300 text-sm font-medium mb-4 px-2">
                Navigate Consciousness
              </div>
              
              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`block w-full p-3 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 border border-purple-400/50'
                            : 'hover:bg-purple-600/20 border border-transparent hover:border-purple-400/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isActive
                              ? 'bg-purple-500/30 text-purple-200'
                              : 'bg-purple-600/20 text-purple-300 group-hover:bg-purple-500/30 group-hover:text-purple-200'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className={`font-semibold transition-colors ${
                              isActive ? 'text-white' : 'text-purple-100 group-hover:text-white'
                            }`}>
                              {item.name}
                            </div>
                            <div className={`text-sm transition-colors ${
                              isActive ? 'text-purple-200' : 'text-purple-400 group-hover:text-purple-300'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                          
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 