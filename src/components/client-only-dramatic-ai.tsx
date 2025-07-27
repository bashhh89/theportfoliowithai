'use client';

import dynamic from 'next/dynamic';

const DramaticAIExperience = dynamic(
  () => import("./dramatic-ai-experience").then(mod => ({ default: mod.DramaticAIExperience })),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-16 h-16 bg-gradient-to-r from-accent to-purple-500 rounded-full shadow-2xl flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-2 border-black rounded-full animate-spin border-t-transparent" />
        </div>
      </div>
    )
  }
);

export function ClientOnlyDramaticAI() {
  return <DramaticAIExperience />;
}