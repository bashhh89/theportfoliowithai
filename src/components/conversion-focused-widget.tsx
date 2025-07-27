'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Target, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function ConversionFocusedWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await supabase.from('leads').insert([{
      email,
      message: `Business type: ${businessType}. Requested automation audit.`,
      source: 'automation_rescue_widget',
      revenue: 'unknown'
    }])
    
    // Track conversion
    if (typeof gtag !== 'undefined') {
      gtag('event', 'automation_audit_claimed', { 
        event_category: 'conversion',
        business_type: businessType 
      })
    }
    
    setSubmitted(true)
    setIsSubmitting(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
    // Track click
    if (typeof gtag !== 'undefined') {
      gtag('event', 'automation_widget_click', { event_category: 'engagement' })
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50 bg-black border border-accent/30 rounded-xl p-6 max-w-sm shadow-2xl"
      >
        <div className="text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-accent font-bold mb-2">Audit Incoming!</h3>
          <p className="text-gray-300 text-sm mb-3">
            Check your email in 10 minutes for your personalized automation roadmap.
          </p>
          <p className="text-xs text-gray-400">
            (If you don't see it, check spam)
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-black px-6 py-3 rounded-full font-bold shadow-2xl transition-all flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Zap className="w-5 h-5" />
        <span>🔥 Free Automation Audit</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-black border border-accent/30 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 p-6 border-b border-accent/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-accent">AUTOMATION RESCUE</h3>
                      <p className="text-gray-400 text-sm">Get your free audit in 10 minutes</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Value Props */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-500/20 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Your biggest bottleneck</p>
                      <p className="text-gray-400 text-sm">I'll identify what's killing your productivity</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Exact automation plan</p>
                      <p className="text-gray-400 text-sm">Step-by-step roadmap to fix it</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">10-minute delivery</p>
                      <p className="text-gray-400 text-sm">Personalized video audit in your inbox</p>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 bg-gray-900/50 border-t border-accent/20">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-accent focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                        required
                      >
                        <option value="">What's your biggest time-waster?</option>
                        <option value="manual_data_entry">Manual data entry</option>
                        <option value="email_management">Email management</option>
                        <option value="lead_follow_up">Lead follow-up</option>
                        <option value="report_generation">Report generation</option>
                        <option value="social_media">Social media posting</option>
                        <option value="customer_support">Customer support</option>
                        <option value="other">Something else</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-accent to-purple-500 hover:from-accent/90 hover:to-purple-500/90 text-black py-3 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending Audit...' : 'Send My Free Audit'}
                    </button>
                  </form>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    No spam. Just your personalized automation roadmap.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}