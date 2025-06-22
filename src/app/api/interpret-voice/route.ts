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

    const { speech_text, interpretation_mode } = await request.json()

    if (!speech_text) {
      return NextResponse.json(
        { error: 'Speech text is required' },
        { status: 400 }
      )
    }

    // Call OpenAI for voice interpretation
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a consciousness interpreter inspired by Terence McKenna. Analyze voice transcripts for consciousness patterns, meaning layers, and transformative potential. Focus on real-time interpretation for living consciousness exploration."
        },
        {
          role: "user",
          content: `Interpret this voice transcript for consciousness patterns and meaning: "${speech_text}"

Return a JSON object with these exact fields:
{
  "interpretation": "primary consciousness interpretation",
  "meaning_data": {
    "consciousness_state": "current state description",
    "meaning_flow": ["array of 3-4 meaning interpretations"],
    "transformative_potential": "transformation assessment",
    "archetypal_presence": ["array of 1-3 archetypal energies"]
  },
  "consciousness_level": 0.75,
  "ineffable_score": 0.6
}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.8
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    let interpretationData
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        interpretationData = JSON.parse(jsonMatch[0])
      } else {
        interpretationData = JSON.parse(content)
      }
    } catch (parseError) {
      // Fallback structured response
      interpretationData = {
        interpretation: "Voice patterns reveal active consciousness exploration and meaning-seeking behavior",
        meaning_data: {
          consciousness_state: "Engaged inquiry and verbal exploration",
          meaning_flow: ["Voice seeking understanding", "Consciousness expressing through speech", "Meaning attempting emergence through articulation"],
          transformative_potential: "Present moment awareness through vocal expression",
          archetypal_presence: ["Seeker", "Voice of inquiry"]
        },
        consciousness_level: 0.65,
        ineffable_score: 0.5
      }
    }

    return NextResponse.json(interpretationData)

  } catch (error) {
    console.error('Voice interpretation error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret voice' },
      { status: 500 }
    )
  }
} 