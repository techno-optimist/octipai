import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { speech_text, interpretation_mode } = await request.json()

    if (!speech_text) {
      return NextResponse.json(
        { error: 'Speech text is required' },
        { status: 400 }
      )
    }

    // Call backend for AI interpretation
    const backendResponse = await fetch('http://localhost:8000/api/interpret-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        speech_text: speech_text,
        interpretation_mode: interpretation_mode || 'interpretation'
      })
    })

    if (!backendResponse.ok) {
      console.error('Backend interpretation failed:', await backendResponse.text())
      return NextResponse.json(
        { error: 'AI interpretation service unavailable' },
        { status: 503 }
      )
    }

    const interpretationData = await backendResponse.json()

    return NextResponse.json({
      interpretation: interpretationData.interpretation,
      meaning_data: interpretationData.meaning_data,
      consciousness_level: interpretationData.consciousness_level,
      ineffable_score: interpretationData.ineffable_score
    })

  } catch (error) {
    console.error('Voice interpretation error:', error)
    return NextResponse.json(
      { error: 'Failed to interpret voice' },
      { status: 500 }
    )
  }
} 