'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function SimpleLeadMagnet() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await supabase.from('leads').insert([{
      email,
      source: 'automation_audit',
      message: 'Requested automation audit'
    }])
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-black text-white p-6 rounded-lg shadow-2xl max-w-sm">
        <div className="text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="font-bold mb-2">Audit Sent!</p>
          <p className="text-sm text-gray-300">Check your email in 5 minutes</p>
        </div>
      </div>
    )
  }

  if (isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-black text-white p-6 rounded-lg shadow-2xl max-w-sm">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ×
        </button>
        
        <h3 className="font-bold mb-2">Get Your Automation Audit</h3>
        <p className="text-sm text-gray-300 mb-4">
          I'll analyze your biggest bottleneck and send you a 2-minute video showing exactly how to automate it.
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full p-2 mb-3 bg-gray-800 border border-gray-600 rounded text-white"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-bold disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send My Audit'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-2xl transition-all hover:scale-105"
    >
      🔥 Free Automation Audit
    </button>
  )
}