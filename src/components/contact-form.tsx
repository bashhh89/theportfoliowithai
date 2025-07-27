'use client'

import { useState, FormEvent } from 'react'
import { supabase } from '@/lib/supabase'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const { error } = await supabase
      .from('leads')
      .insert([{
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
        revenue: formData.get('revenue') as string,
      }])
    
    if (!error) {
      setSubmitted(true)
      // Send notification email to you
      await fetch('/api/notify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
          revenue: formData.get('revenue'),
        })
      })
    }
    
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-6xl">✅</div>
        <h3 className="text-2xl font-bold text-accent">MESSAGE RECEIVED</h3>
        <p className="text-gray-300">
          I'll analyze your bottleneck and respond within 24 hours with a straight answer.
        </p>
        <p className="text-sm text-gray-400">
          Check your email for confirmation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
      <div>
        <label className="block text-sm font-medium mb-2 uppercase tracking-wide">YOUR NAME</label>
        <input 
          name="name"
          type="text" 
          className="w-full p-4 bg-white/5 border border-white/20 focus:border-accent focus:bg-white/10 transition-all outline-none"
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 uppercase tracking-wide">YOUR EMAIL</label>
        <input 
          name="email"
          type="email" 
          className="w-full p-4 bg-white/5 border border-white/20 focus:border-accent focus:bg-white/10 transition-all outline-none"
          required 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 uppercase tracking-wide">YOUR BIGGEST BOTTLENECK</label>
        <textarea 
          name="message"
          className="w-full p-4 bg-white/5 border border-white/20 focus:border-accent focus:bg-white/10 transition-all outline-none min-h-32 resize-vertical"
          placeholder="What manual process is killing your productivity? Be specific about the pain point..."
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 uppercase tracking-wide">CURRENT MONTHLY REVENUE (OPTIONAL)</label>
        <input 
          name="revenue"
          type="text" 
          className="w-full p-4 bg-white/5 border border-white/20 focus:border-accent focus:bg-white/10 transition-all outline-none"
          placeholder="Helps me understand your scale and automation budget"
        />
      </div>
      
      <div className="text-center">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="futuristic-button px-8 py-4 text-lg font-semibold tracking-wider uppercase disabled:opacity-50"
        >
          {isSubmitting ? 'SENDING...' : 'GET MY REALITY CHECK'}
        </button>
        <p className="text-gray-400 text-sm mt-4">
          I'll respond within 24 hours with a straight answer
        </p>
      </div>
    </form>
  )
}