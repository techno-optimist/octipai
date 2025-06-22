'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Loader, MapPin, Radar, Video, VideoOff, Scan, Target } from 'lucide-react'
import { AuroraBackground } from '@/components/AuroraBackground'
import Navigation from '@/components/Navigation'

interface MeaningField {
  field_type: string
  spatial_location: string
  description: string
  intensity: number
  emotional_signature: string
}

interface EnvironmentalScanData {
  overall_consciousness_level: number
  dominant_meaning_theme: string
  detected_fields: MeaningField[]
  social_dynamics_visible: string[]
  invisible_structures: string[]
  processing_time_ms: number
}

export default function EnvironmentalCameraPage() {
  // Camera states
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Scanning states
  const [isScanning, setIsScanning] = useState(false)
  const [scanData, setScanData] = useState<EnvironmentalScanData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Overlay states
  const [showOverlays, setShowOverlays] = useState(false)
  const [scanPosition, setScanPosition] = useState({ x: 50, y: 50 }) // percentage position

  // Initialize camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      })
      
      setStream(mediaStream)
      setIsCameraActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Camera access error:', err)
      setCameraError('Camera access denied. Please enable camera permissions and try again.')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }, [stream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Capture frame from video
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return null
    
    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0)
    
    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8)
  }, [])

  // Scan current camera view
  const scanEnvironment = useCallback(async () => {
    if (!isCameraActive) return
    
    setIsScanning(true)
    setError(null)
    setScanData(null)
    
    try {
      // Capture current frame
      const frameData = captureFrame()
      if (!frameData) {
        throw new Error('Failed to capture camera frame')
      }
      
      // Convert base64 to blob for API
      const response = await fetch(frameData)
      const blob = await response.blob()
      
      // Create FormData with image
      const formData = new FormData()
      formData.append('file', blob, 'camera_frame.jpg')
      
      // Send to environmental analysis API
      const analysisResponse = await fetch('/api/scan-environment', {
        method: 'POST',
        body: formData
      })

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json()
        throw new Error(errorData.error || 'Failed to analyze environment')
      }

      const data = await analysisResponse.json()
      setScanData(data)
      setShowOverlays(true)
      
    } catch (error) {
      console.error('Error scanning environment:', error)
      setError(error instanceof Error ? error.message : 'Failed to scan environment')
    } finally {
      setIsScanning(false)
    }
  }, [isCameraActive, captureFrame])

  // Handle scan position click
  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCameraActive) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setScanPosition({ x, y })
    scanEnvironment()
  }, [isCameraActive, scanEnvironment])

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
        
        <div className="flex-1 flex items-center justify-center p-4">
          {/* Camera Interface */}
          <div className="max-w-2xl mx-auto">
            {!isCameraActive ? (
              // Camera Permission State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center"
              >
                <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-white text-2xl font-semibold mb-3">
                  Activate Environmental Vision
                </h3>
                <p className="text-purple-200 mb-6">
                  Grant camera access to begin scanning physical spaces for meaning fields
                </p>
                <button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 mx-auto"
                >
                  <Video className="w-6 h-6" />
                  Start Camera Scanner
                </button>
                
                {cameraError && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
                    <p className="text-red-200">{cameraError}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              // Active Camera State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-4 overflow-hidden"
              >
                {/* Video Feed Container */}
                <div className="relative">
                  <div 
                    className="relative w-full aspect-video bg-black rounded-xl overflow-hidden cursor-crosshair"
                    onClick={handleVideoClick}
                  >
                    {/* Video Element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Scan Target Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Crosshair at scan position */}
                      <motion.div
                        className="absolute w-8 h-8 border-2 border-purple-400 rounded-full bg-purple-400/20"
                        style={{
                          left: `${scanPosition.x}%`,
                          top: `${scanPosition.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                          scale: isScanning ? [1, 1.5, 1] : 1,
                          opacity: isScanning ? [1, 0.5, 1] : 1
                        }}
                        transition={{
                          duration: isScanning ? 1 : 0,
                          repeat: isScanning ? Infinity : 0
                        }}
                      >
                        <Target className="w-4 h-4 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </motion.div>
                      
                      {/* Meaning Field Overlays */}
                      {showOverlays && scanData?.detected_fields.map((field, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="absolute bg-blue-500/20 border border-blue-400/50 rounded-xl p-2 min-w-48 max-w-64"
                          style={{
                            left: `${Math.random() * 60 + 20}%`,
                            top: `${Math.random() * 60 + 20}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="text-white text-sm font-medium mb-1">
                            {field.field_type}
                          </div>
                          <div className="text-blue-200 text-xs mb-2">
                            {field.description}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-1 bg-blue-900 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-blue-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${field.intensity * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                            <span className="text-blue-200 text-xs">
                              {Math.round(field.intensity * 100)}%
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Consciousness Level Overlay */}
                      {showOverlays && scanData && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-4 left-4 bg-purple-500/20 border border-purple-400/50 rounded-xl p-3"
                        >
                          <div className="text-purple-200 text-sm mb-2">Consciousness Level</div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-purple-900 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${scanData.overall_consciousness_level * 100}%` }}
                                transition={{ duration: 1.5 }}
                              />
                            </div>
                            <span className="text-white text-sm font-semibold">
                              {Math.round(scanData.overall_consciousness_level * 100)}%
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={stopCamera}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <VideoOff className="w-4 h-4" />
                        Stop Camera
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowOverlays(false)
                          setScanData(null)
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                        disabled={!showOverlays}
                      >
                        Clear Overlays
                      </button>
                    </div>
                    
                    <div className="text-purple-200 text-sm">
                      {isScanning ? (
                        <div className="flex items-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          Scanning meaning fields...
                        </div>
                      ) : (
                        'Click anywhere to scan'
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

        </div>

        {/* Analysis Results - Full Screen Overlay */}
        <AnimatePresence>
          {scanData && (
            <div className="fixed inset-0 z-40 overflow-y-auto pt-20 pb-8 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-4xl mx-auto px-4 space-y-4"
              >
                {/* Dominant Theme */}
                <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-semibold mb-3 flex items-center gap-2">
                    <Radar className="w-5 h-5 text-purple-400" />
                    Dominant Meaning Theme
                  </h3>
                  <p className="text-purple-200 text-lg">{scanData.dominant_meaning_theme}</p>
                </div>

                {/* Social Dynamics */}
                <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Visible Social Dynamics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scanData.social_dynamics_visible.map((dynamic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-blue-700/30 to-cyan-700/30 p-3 rounded-xl border border-blue-400/30"
                      >
                        <div className="text-white flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          <span>{dynamic}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Invisible Structures */}
                <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Invisible Structures</h3>
                  <div className="space-y-2">
                    {scanData.invisible_structures.map((structure, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-white flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{structure}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <div className="fixed bottom-4 left-4 right-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-2xl mx-auto bg-red-900/30 border border-red-500/50 rounded-2xl p-4"
              >
                <div className="text-red-200 text-center">
                  <strong>Error:</strong> {error}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 