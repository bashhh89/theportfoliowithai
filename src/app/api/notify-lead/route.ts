import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { name, email, message, revenue } = await request.json()
  
  // Send yourself an email notification
  // Replace with your email service (SendGrid, Resend, etc.)
  console.log('NEW LEAD:', { name, email, message, revenue })
  
  // For now, just log it. Add email service later.
  
  return NextResponse.json({ success: true })
}