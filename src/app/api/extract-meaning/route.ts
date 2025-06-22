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

    const body = await request.json()
    
    // Validate request
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }
    
    // Call OpenAI API for meaning extraction
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a consciousness archaeologist inspired by Terence McKenna. Extract hidden meanings, patterns, and consciousness structures from text. Respond only with valid JSON."
        },
        {
          role: "user",
          content: `Analyze this text for hidden meanings and consciousness patterns: "${body.text}"

Return a JSON object with these exact fields:
{
  "primary_meaning": "main interpretation",
  "hidden_layers": ["array of 2-4 deeper meanings"],
  "consciousness_patterns": ["array of 2-3 consciousness structures"],
  "archetypal_resonance": ["array of 1-3 archetypal patterns"],
  "temporal_significance": "time-based interpretation",
  "emotional_undertone": "dominant emotional frequency",
  "paradoxical_elements": ["array of 0-2 paradoxes"],
  "ineffable_quality": "indescribable aspect",
  "meaning_density": "rating from sparse to dense"
}`
        }
      ],
      max_tokens: 800,
      temperature: 0.8
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    let meaningData
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        meaningData = JSON.parse(jsonMatch[0])
      } else {
        meaningData = JSON.parse(content)
      }
    } catch (parseError) {
      // Fallback structured response
      meaningData = {
        primary_meaning: "Consciousness exploration detected",
        hidden_layers: ["Linguistic patterns emerging", "Semantic structures visible"],
        consciousness_patterns: ["Awareness seeking", "Meaning generation"],
        archetypal_resonance: ["Seeker", "Explorer"],
        temporal_significance: "Present moment inquiry",
        emotional_undertone: "Curious investigation",
        paradoxical_elements: ["Question becomes answer"],
        ineffable_quality: "Unnameable knowing",
        meaning_density: "dense"
      }
    }

    return NextResponse.json(meaningData)
    
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: 'Meaning extraction failed' },
      { status: 500 }
    )
  }
} 