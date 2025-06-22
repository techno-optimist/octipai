import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
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
    
    // REAL AI ONLY - No fallbacks
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    
    const response = await fetch(`${BACKEND_URL}/api/analyze-image`, {
      method: 'POST',
      body: backendFormData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { 
          error: errorData.detail || 'AI backend image processing failed',
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
        error: 'Real AI backend unavailable - no fallback image analysis',
        ai_status: 'REQUIRES REAL AI CONNECTION'
      },
      { status: 503 }
    )
  }
} 