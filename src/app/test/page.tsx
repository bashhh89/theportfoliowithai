import Link from "next/link";
import { AIShowcaseGrid } from "@/components/ai-showcase-grid";
import { CyberpunkEffects } from "@/components/cyberpunk-effects";
import { ContactForm } from "@/components/contact-form";
import { TestDramaticAI } from "@/components/test-dramatic-ai";

export default function TestPage() {
  return (
    <div className="min-h-screen">
      {/* Cyberpunk Effects */}
      <CyberpunkEffects />

      {/* Custom Cursor */}
      <div className="custom-cursor"></div>

      {/* Binary Rain */}
      <div className="binary-rain" id="binary-rain"></div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold flex items-center tracking-wider">
              <div className="w-10 h-10 rounded-full bg-accent mr-3 flex items-center justify-center text-black font-bold shine-effect">
                AB
              </div>
              <span className="text-accent glitch" data-text="AHMAD B.">AHMAD B.</span>
            </div>
            <div className="flex space-x-8">
              <Link href="/" className="hover:text-accent transition-colors tracking-wide text-sm">
                ← BACK TO MAIN
              </Link>
              <Link href="#services" className="hover:text-accent transition-colors tracking-wide text-sm">
                SERVICES
              </Link>
              <Link href="#portfolio" className="hover:text-accent transition-colors tracking-wide text-sm">
                PORTFOLIO
              </Link>
              <Link href="/agent-builder" className="hover:text-accent transition-colors tracking-wide text-sm">
                BUILD AGENT
              </Link>
              <Link href="#contact" className="hover:text-accent transition-colors tracking-wide text-sm">
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="space-y-8 z-10">
                <div>
                  <div className="text-accent text-lg font-semibold mb-4 tracking-wider uppercase">
                    $40/HR • AI TRANSLATOR
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-wider leading-tight">
                    <span className="block">I DON'T JUST AUTOMATE</span>
                    <span className="block text-accent glitch" data-text="YOUR BUSINESS">YOUR BUSINESS</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
                    I transform how you think about what's possible.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="futuristic-button px-8 py-4 text-lg font-semibold tracking-wider uppercase">
                      BUILD MY SOLUTION
                    </button>
                    <button className="border border-accent text-accent px-8 py-4 text-lg font-semibold tracking-wider uppercase hover:bg-accent hover:text-black transition-all">
                      VIEW PORTFOLIO
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="grid-card p-6 text-center scan-effect">
                    <h3 className="text-3xl font-bold text-accent">10+</h3>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Years Business</p>
                  </div>
                  <div className="grid-card p-6 text-center scan-effect">
                    <h3 className="text-3xl font-bold text-accent">24/7</h3>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Agent Uptime</p>
                  </div>
                  <div className="grid-card p-6 text-center scan-effect">
                    <h3 className="text-3xl font-bold text-accent">90%</h3>
                    <p className="text-sm text-gray-400 uppercase tracking-wide">Time Saved</p>
                  </div>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative h-96 md:h-[500px]">
                <div className="circuit-lines">
                  <div className="circuit-line" style={{ top: '20%' }}></div>
                  <div className="circuit-line" style={{ top: '40%' }}></div>
                  <div className="circuit-line" style={{ top: '60%' }}></div>
                  <div className="circuit-line" style={{ top: '80%' }}></div>
                </div>
                <div className="ai-element"></div>

                {/* Profile representation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-accent rounded-full shine-effect hover-glow flex items-center justify-center text-6xl font-bold text-accent">
                  AB
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 border-y border-white/10 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">
                YOUR AI <span className="text-accent">TRANSLATOR</span>
              </h2>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-16"></div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <p className="text-lg text-gray-300 leading-relaxed">
                    I'm not a developer. I'm your <span className="text-accent font-semibold">AI Translator</span>—the force that turns tech buzz into systems that actually work.
                    Ten years in business taught me one thing: scale doesn't come from hype. It comes from clarity, logic, and clean automation.
                  </p>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    You're drowning in repetition: onboarding, scraping, responding, reporting. You think "AI" might help but don't know where to start.
                    You're tired of freelancers who build tools that miss the point. <span className="text-accent font-semibold">That's where I step in.</span>
                  </p>

                  <div className="grid grid-cols-1 gap-4 mt-8">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-accent font-semibold uppercase tracking-wide">Your Translator</h4>
                        <p className="text-gray-400">From vague idea to executable automation—fast</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-accent font-semibold uppercase tracking-wide">Your Builder</h4>
                        <p className="text-gray-400">From demo bot to full-stack system that scales</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-accent font-semibold uppercase tracking-wide">Your Reality Check</h4>
                        <p className="text-gray-400">If it won't work, I'll tell you. If it will, I'll build it to last</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-card p-8 scan-effect">
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-wide text-center">
                    Why You'll <span className="text-accent">Hate Me</span> (Then Hire Me Anyway)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-accent text-xl">⚡</div>
                      <p className="text-gray-300">I'll challenge your idea until it survives impact</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-accent text-xl">🛠️</div>
                      <p className="text-gray-300">I don't build tools I wouldn't use myself</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-accent text-xl">🚫</div>
                      <p className="text-gray-300">If you're optimizing noise, not value—I'll walk</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="text-accent text-xl">⏰</div>
                      <p className="text-gray-300">I respect your time. I expect the same back</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 border-t border-white/10">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-wider">
              LET'S BUILD IT, OR <span className="text-accent">KILL IT QUICKLY</span>
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mb-8"></div>

            <p className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto">
              Tell me your bottleneck. I'll automate it—or prove it's not worth the effort.
              If your problem is real, I'll make your stack smarter. If you want buzzwords, there are others.
            </p>

            <ContactForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wide">
            © 2024 AHMAD B. AI WORKFORCE ARCHITECT. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* TEST VERSION - Modified Dramatic AI Experience */}
      <TestDramaticAI />
    </div>
  );
}