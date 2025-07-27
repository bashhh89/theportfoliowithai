import Link from "next/link";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-foreground mb-8">
        I Live in the Gap Between Business and AI.
      </h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Photo placeholder</span>
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            Bio content will go here. This is where you'll tell your story about bridging 
            the gap between business needs and AI solutions.
          </p>
          <p className="text-foreground leading-relaxed">
            Additional bio content and expertise details...
          </p>
        </div>
      </div>
    </div>
  )
}