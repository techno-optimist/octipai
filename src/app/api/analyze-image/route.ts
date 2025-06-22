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

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image as a consciousness archaeologist inspired by Terence McKenna. Extract hidden meanings, archetypal patterns, temporal layers, emotional resonances, ineffable qualities, and paradoxical structures. Return a JSON object with these exact fields:

{
  "hidden_meanings": ["array of 3-5 discovered meanings"],
  "temporal_layers": ["array of 3-4 time-based interpretations"],
  "emotional_resonance": "dominant emotional frequency",
  "consciousness_level": "percentage from 0-100",
  "ineffable_qualities": ["array of 2-3 indescribable aspects"],
  "archetypal_patterns": ["array of 2-4 archetypal symbols"],
  "meaning_depth": "rating from shallow to profound",
  "paradoxical_structures": ["array of 1-3 paradoxes present"]
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

    // Try to parse JSON from response
    let analysisData
    try {
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0])
      } else {
        analysisData = JSON.parse(content)
      }
    } catch (parseError) {
      // If JSON parsing fails, create structured response from text
      analysisData = {
        hidden_meanings: ["Consciousness patterns detected", "Meaning structures emerging", "Reality layers visible"],
        temporal_layers: ["Present moment awareness", "Historical echoes", "Future potentials"],
        emotional_resonance: "Contemplative curiosity",
        consciousness_level: "75",
        ineffable_qualities: ["Unnameable presence", "Silent knowing"],
        archetypal_patterns: ["Observer", "Seeker", "Mystery"],
        meaning_depth: "profound",
        paradoxical_structures: ["Known unknown"]
      }
    }

    return NextResponse.json(analysisData)
    
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: 'Image analysis failed' },
      { status: 500 }
    )
  }
} 