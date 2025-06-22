import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const contentType = request.headers.get('content-type')
    
    // Handle both image files (from camera) and text descriptions (legacy)
    if (contentType?.includes('multipart/form-data')) {
      // Image upload from camera
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'Image file is required for camera scanning' },
          { status: 400 }
        )
      }
      
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File must be an image for environmental scanning' },
          { status: 400 }
        )
      }
      
      // Convert file to base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = file.type
      const dataUrl = `data:${mimeType};base64,${base64}`

      // Analyze image for environmental data using OpenAI Vision
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `As an environmental consciousness scanner inspired by Terence McKenna, analyze this space for invisible meaning fields, social dynamics, and consciousness patterns. 

Return a JSON object with these exact fields:
{
  "detected_fields": [
    {
      "field_type": "type of meaning field",
      "spatial_location": "location description",
      "description": "field description",
      "intensity": 0.5,
      "emotional_signature": "emotional quality"
    }
  ],
  "social_dynamics_visible": ["array of 2-3 social patterns visible"],
  "overall_consciousness_level": 0.75,
  "invisible_structures": ["array of 3-4 hidden structures"],
  "dominant_meaning_theme": "primary theme of the space",
  "processing_time_ms": 750
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Parse JSON response
      let environmentalData
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          environmentalData = JSON.parse(jsonMatch[0])
        } else {
          environmentalData = JSON.parse(content)
        }
      } catch (parseError) {
        // Fallback structured response for images
        environmentalData = {
          detected_fields: [
            {
              field_type: "Spatial Consciousness",
              spatial_location: "Central area",
              description: "Accumulated meaning patterns and energy signatures",
              intensity: 0.7,
              emotional_signature: "Contemplative"
            },
            {
              field_type: "Temporal Echo",
              spatial_location: "Background layers",
              description: "Historical consciousness imprints and memory traces",
              intensity: 0.5,
              emotional_signature: "Nostalgic"
            }
          ],
          social_dynamics_visible: ["Space usage patterns", "Interaction flows", "Territorial dynamics"],
          overall_consciousness_level: 0.65,
          invisible_structures: ["Movement patterns", "Energy boundaries", "Meaning accumulation zones", "Temporal resonance layers"],
          dominant_meaning_theme: "Layered consciousness with active and dormant meaning fields",
          processing_time_ms: 850
        }
      }

      return NextResponse.json(environmentalData)
      
    } else {
      // Text description (legacy support)
      const body = await request.json()
      
      if (!body.description || typeof body.description !== 'string') {
        return NextResponse.json(
          { error: 'Description is required and must be a string' },
          { status: 400 }
        )
      }
      
      if (body.description.length < 10) {
        return NextResponse.json(
          { error: 'Description must be at least 10 characters' },
          { status: 400 }
        )
      }
      
      // Use OpenAI for text-based environmental scanning
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an environmental consciousness scanner inspired by Terence McKenna. Scan described spaces for invisible meaning fields, social dynamics, and consciousness patterns."
          },
          {
            role: "user",
            content: `Scan this environment for meaning fields and consciousness patterns: "${body.description}"

Return a JSON object with these exact fields:
{
  "detected_fields": [
    {
      "field_type": "type of meaning field",
      "spatial_location": "location description", 
      "description": "field description",
      "intensity": 0.5,
      "emotional_signature": "emotional quality"
    }
  ],
  "social_dynamics_visible": ["array of 2-3 social patterns"],
  "overall_consciousness_level": 0.75,
  "invisible_structures": ["array of 3-4 hidden structures"],
  "dominant_meaning_theme": "primary theme of the space",
  "processing_time_ms": 750
}`
          }
        ],
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('No response from OpenAI')
      }

      // Parse JSON response
      let environmentalData
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          environmentalData = JSON.parse(jsonMatch[0])
        } else {
          environmentalData = JSON.parse(content)
        }
      } catch (parseError) {
        // Fallback structured response for text
        environmentalData = {
          detected_fields: [
            {
              field_type: "Consciousness Field",
              spatial_location: "Described area",
              description: "Environmental awareness and meaning patterns",
              intensity: 0.6,
              emotional_signature: "Contemplative"
            }
          ],
          social_dynamics_visible: ["Described interactions", "Environmental relationships"],
          overall_consciousness_level: 0.55,
          invisible_structures: ["Meaning patterns", "Consciousness flows", "Environmental memory"],
          dominant_meaning_theme: "Textual consciousness exploration and environmental inquiry",
          processing_time_ms: 650
        }
      }

      return NextResponse.json(environmentalData)
    }
    
  } catch (error) {
    console.error('Environmental Scanning Error:', error)
    return NextResponse.json(
      { error: 'Environmental scanning failed' },
      { status: 500 }
    )
  }
}

// Transform image analysis results into environmental scanning format
function transformImageToEnvironmentalData(imageData: any) {
  // Extract environmental meaning from image analysis results
  const meaningFields = generateMeaningFields(imageData)
  const socialDynamics = extractSocialDynamics(imageData)
  const invisibleStructures = extractInvisibleStructures(imageData)
  
  return {
    overall_consciousness_level: imageData.consciousness_level || 0.7,
    dominant_meaning_theme: imageData.hidden_meanings?.[0] || "Spatial consciousness and environmental awareness",
    detected_fields: meaningFields,
    social_dynamics_visible: socialDynamics,
    invisible_structures: invisibleStructures,
    processing_time_ms: Date.now() % 1000 + 500, // Simulated processing time
    
    // Include original image analysis for reference
    image_analysis: {
      ineffable_score: imageData.ineffable_score,
      consciousness_level: imageData.consciousness_level,
      meaning_depth_score: imageData.meaning_depth_score,
      hidden_meanings: imageData.hidden_meanings,
      ineffable_qualities: imageData.ineffable_qualities,
      temporal_layers: imageData.temporal_layers
    }
  }
}

// Generate meaning fields from image analysis
function generateMeaningFields(imageData: any) {
  const fields = []
  const hiddenMeanings = imageData.hidden_meanings || []
  const ineffableQualities = imageData.ineffable_qualities || []
  
  // Create fields based on hidden meanings
  hiddenMeanings.slice(0, 3).forEach((meaning: string, index: number) => {
    fields.push({
      field_type: `Meaning Field ${index + 1}`,
      spatial_location: getRandomLocation(),
      description: meaning,
      intensity: Math.random() * 0.4 + 0.6, // 0.6-1.0 intensity
      emotional_signature: getEmotionalSignature(meaning)
    })
  })
  
  // Create fields based on ineffable qualities
  ineffableQualities.slice(0, 2).forEach((quality: string, index: number) => {
    fields.push({
      field_type: `Ineffable Field`,
      spatial_location: getRandomLocation(),
      description: quality,
      intensity: Math.random() * 0.3 + 0.7, // 0.7-1.0 intensity for ineffable
      emotional_signature: "Transcendent"
    })
  })
  
  // Ensure we have at least 2 fields
  if (fields.length < 2) {
    fields.push({
      field_type: "Consciousness Field",
      spatial_location: "Central area",
      description: "Ambient awareness and presence patterns detected in the spatial environment",
      intensity: imageData.consciousness_level || 0.6,
      emotional_signature: "Contemplative"
    })
  }
  
  return fields
}

// Extract social dynamics from image content
function extractSocialDynamics(imageData: any) {
  const dynamics = []
  
  // Base social dynamics from environmental consciousness
  const consciousnessLevel = imageData.consciousness_level || 0.5
  
  if (consciousnessLevel > 0.7) {
    dynamics.push("High collective awareness and shared intentionality")
    dynamics.push("Harmonious social energy flows and collaborative patterns")
    dynamics.push("Elevated group consciousness and synchronized presence")
  } else if (consciousnessLevel > 0.4) {
    dynamics.push("Moderate social cohesion with interpersonal awareness")
    dynamics.push("Emerging collaborative patterns and shared understanding")
    dynamics.push("Balanced individual and collective consciousness")
  } else {
    dynamics.push("Individual focus with limited collective awareness")
    dynamics.push("Fragmented social patterns and disconnected energies")
    dynamics.push("Lower group consciousness and separate intentionalities")
  }
  
  // Add dynamics based on temporal layers if available
  if (imageData.temporal_layers) {
    dynamics.push("Historical social patterns embedded in environmental memory")
    dynamics.push("Temporal social dynamics influencing present moment interactions")
  }
  
  return dynamics.slice(0, 4) // Limit to 4 dynamics
}

// Extract invisible structures from environmental analysis
function extractInvisibleStructures(imageData: any) {
  const structures = []
  
  // Base structures from meaning depth
  const meaningDepth = imageData.meaning_depth_score || 0.5
  
  structures.push("Geometric patterns of social interaction and movement flows")
  structures.push("Energetic boundaries and territorial consciousness demarcations")
  structures.push("Memory accumulation layers embedded in physical space")
  
  if (meaningDepth > 0.7) {
    structures.push("Deep archetypal resonance patterns connecting space to collective unconscious")
    structures.push("Temporal meaning bridges linking past, present, and future intentions")
    structures.push("Consciousness field gradients creating invisible organizational hierarchies")
  }
  
  if (imageData.ineffable_score > 0.6) {
    structures.push("Ineffable presence fields transcending normal spatial perception")
    structures.push("Sacred geometry patterns invisible to ordinary consciousness")
  }
  
  // Add temporal structures if available
  if (imageData.temporal_layers) {
    structures.push("Temporal resonance chambers holding accumulated experiences")
    structures.push("Future potential fields shaping present spatial dynamics")
  }
  
  return structures.slice(0, 6) // Limit to 6 structures
}

// Helper functions
function getRandomLocation(): string {
  const locations = [
    "Northeast quadrant",
    "Central focal point", 
    "Western periphery",
    "Southern boundary",
    "Upper spatial layer",
    "Background depth field",
    "Transitional zone",
    "Convergence point"
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

function getEmotionalSignature(meaning: string): string {
  // Simple emotional classification based on meaning content
  const lowerMeaning = meaning.toLowerCase()
  
  if (lowerMeaning.includes('warm') || lowerMeaning.includes('comfort') || lowerMeaning.includes('nurtur')) {
    return "Nurturing"
  } else if (lowerMeaning.includes('tense') || lowerMeaning.includes('conflict') || lowerMeaning.includes('stress')) {
    return "Tension"
  } else if (lowerMeaning.includes('creative') || lowerMeaning.includes('inspire') || lowerMeaning.includes('flow')) {
    return "Creative"
  } else if (lowerMeaning.includes('spiritual') || lowerMeaning.includes('sacred') || lowerMeaning.includes('transcendent')) {
    return "Sacred"
  } else if (lowerMeaning.includes('memory') || lowerMeaning.includes('nostalgia') || lowerMeaning.includes('past')) {
    return "Nostalgic"
  } else {
    return "Contemplative"
  }
} 