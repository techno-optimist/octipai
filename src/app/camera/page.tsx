'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader, ImageIcon, Info } from 'lucide-react'
import MeaningIridescence from '@/components/MeaningIridescence'
import { MeaningDimensions } from '@/components/MeaningSalience'
import { AuroraBackground } from '@/components/AuroraBackground'
import Navigation from '@/components/Navigation'

export default function TemporalCameraPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }, [])

  const analyzeImage = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setError('Failed to analyze image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora background layer - absolute positioned */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground>
          <div />
        </AuroraBackground>
      </div>

      {/* Main content layer - highest z-index */}
      <div className="relative z-30 min-h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center justify-center p-4 space-y-6 min-h-full">
            {/* Upload section - only show when no image is selected */}
            {!imagePreview && (
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md">
                <div
                  className="border-2 border-dashed border-white/50 rounded-xl p-6 text-center hover:border-white/70 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-white/70 mx-auto mb-4" />
                    <p className="text-white/90 text-lg font-medium mb-2">
                      Drop an image here
                    </p>
                    <p className="text-white/60 text-sm">
                      or click to browse
                    </p>
                  </label>
                </div>
              </div>
            )}

            {/* Image preview and analysis */}
            {imagePreview && (
              <div className="space-y-4 w-full max-w-2xl">
                {/* Image display with MeaningIridescence background */}
                <div className="relative bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 overflow-hidden">
                  {/* MeaningIridescence as localized background - only behind image */}
                  {analysisData && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <MeaningIridescence
                        meaningData={{
                          INEFFABLE_QUALITY: analysisData.ineffable_score,
                          TEMPORAL_FLOW: analysisData.consciousness_level * 0.85,
                          EMOTIONAL_SUBSTRATE: analysisData.meaning_depth_score * 0.9,
                          RELATIONAL_DYNAMICS: Math.min(1, analysisData.hidden_meanings?.length / 5 || 0),
                          CONSCIOUSNESS_LEVEL: analysisData.consciousness_level,
                          PARADOX_TENSION: analysisData.ineffable_score * 0.7,
                          ARCHETYPAL_RESONANCE: analysisData.meaning_depth_score * 0.8,
                          TRANSFORMATIVE_POTENTIAL: analysisData.consciousness_level * 0.9,
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Floating image with white border */}
                  <div className="relative z-10 flex justify-center">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="max-w-md max-h-80 object-contain rounded-xl shadow-2xl border-4 border-white/90"
                    />
                  </div>
                  
                  {/* Analyze button */}
                  {!isAnalyzing && !analysisData && (
                    <button
                      onClick={analyzeImage}
                      disabled={!selectedFile}
                      className="relative z-10 mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      Begin Temporal Archaeology
                    </button>
                  )}

                  {/* Loading state */}
                  {isAnalyzing && (
                    <div className="relative z-10 mt-6 p-4 bg-black/30 rounded-lg">
                      <div className="flex items-center justify-center gap-3">
                        <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                        <span className="text-white/90">Excavating temporal meaning layers...</span>
                      </div>
                    </div>
                  )}

                  {/* Change image button */}
                  <button
                    onClick={() => {
                      setImagePreview(null)
                      setSelectedFile(null)
                      setAnalysisData(null)
                      setError(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="relative z-10 mt-3 w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200"
                  >
                    Change Image
                  </button>
                </div>

                {/* Analysis results */}
                {analysisData && (
                  <div className="space-y-4 pb-8">
                    {/* Hidden Meanings */}
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-purple-400" />
                        Hidden Meanings
                      </h3>
                      <div className="space-y-3">
                        {analysisData.hidden_meanings?.map((meaning: string, index: number) => (
                          <div key={index} className="bg-white/10 rounded-lg p-3">
                            <p className="text-white/90 text-sm">{meaning}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ineffable Qualities */}
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white text-xl font-semibold mb-4">Ineffable Qualities</h3>
                      <div className="space-y-2">
                        {analysisData.ineffable_qualities?.map((quality: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-purple-400 mt-1">•</span>
                            <p className="text-white/90 text-sm">{quality}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Temporal Layers */}
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white text-xl font-semibold mb-4">Temporal Layers</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisData.temporal_layers && (
                          Array.isArray(analysisData.temporal_layers) 
                            ? analysisData.temporal_layers.map((layer: any, index: number) => (
                                <div key={index} className="bg-white/10 rounded-lg p-3">
                                  <h4 className="text-blue-400 font-medium mb-2">
                                    {layer.layer_name || `Layer ${index + 1}`}
                                  </h4>
                                  <p className="text-white/80 text-sm mb-2">{layer.description}</p>
                                  {layer.temporal_period && (
                                    <p className="text-purple-300 text-xs">{layer.temporal_period}</p>
                                  )}
                                  {layer.intensity && (
                                    <div className="mt-2">
                                      <div className="flex justify-between text-xs">
                                        <span className="text-white/60">Intensity</span>
                                        <span className="text-white/80">{Math.round(layer.intensity * 100)}%</span>
                                      </div>
                                      <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                                        <div 
                                          className="bg-gradient-to-r from-purple-400 to-blue-400 h-1 rounded-full"
                                          style={{ width: `${layer.intensity * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            : Object.entries(analysisData.temporal_layers).map(([layer, description]: [string, any]) => (
                                <div key={layer} className="bg-white/10 rounded-lg p-3">
                                  <h4 className="text-blue-400 font-medium capitalize mb-2">{layer.replace('_', ' ')}</h4>
                                  <p className="text-white/80 text-sm">
                                    {typeof description === 'string' ? description : JSON.stringify(description)}
                                  </p>
                                </div>
                              ))
                        )}
                      </div>
                    </div>

                    {/* Analysis Summary */}
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                      <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-green-400" />
                        Meaning Translation Summary
                      </h3>
                      <div className="space-y-4 text-white/90">
                        <div>
                          <h4 className="text-purple-300 font-medium mb-2">🧠 AI Processing</h4>
                          <p className="text-sm leading-relaxed">
                            Your image was analyzed through our McKenna-inspired meaning extraction system. Rather than simple object detection, 
                            we excavated the deeper semantic layers - the ineffable qualities, temporal resonances, and archetypal patterns 
                            that exist beyond linguistic reduction.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-blue-300 font-medium mb-2">🌊 Visual Consciousness</h4>
                          <p className="text-sm leading-relaxed">
                            The flowing iridescent background behind your image represents the AI's attempt to "become the meaning" - 
                            like McKenna's octopi that don't just display emotions but physically transform into their communication. 
                            Each ripple and color shift corresponds to the extracted meaning dimensions.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-pink-300 font-medium mb-2">✨ Octopus Translation</h4>
                          <p className="text-sm leading-relaxed">
                            This is visual telepathy in action - meaning translated directly into flowing, organic patterns without 
                            the reductive step of language. The silk-like membrane becomes a living representation of the image's 
                            consciousness signature, preserving nuance that words would destroy.
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xs text-white/60 italic">
                            "The octopus doesn't think about what it's feeling - it becomes its feeling, becomes the very thing it's trying to communicate." 
                            - Inspired by Terence McKenna
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