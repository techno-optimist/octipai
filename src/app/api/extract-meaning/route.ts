import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request
    if (!body.text || typeof body.text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      )
    }
    
    // REAL AI ONLY - No fallbacks
    const response = await fetch(`${BACKEND_URL}/api/extract-meaning`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: body.text })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { 
          error: errorData.detail || 'AI backend processing failed',
          ai_status: 'REAL AI REQUIRED - NO FALLBACKS'
        },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { 
        error: 'Real AI backend unavailable - no fallback responses',
        ai_status: 'REQUIRES REAL AI CONNECTION'
      },
      { status: 503 }
    )
  }
} 