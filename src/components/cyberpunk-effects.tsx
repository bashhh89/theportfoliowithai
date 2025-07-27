'use client';

import { useEffect } from 'react';

export function CyberpunkEffects() {
  useEffect(() => {
    // Custom cursor functionality
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };

    const handleMouseDown = () => {
      if (cursor) {
        cursor.style.transform = 'scale(0.8)';
      }
    };

    const handleMouseUp = () => {
      if (cursor) {
        cursor.style.transform = 'scale(1)';
      }
    };

    // Binary rain effect
    const createBinaryRain = () => {
      const binaryRain = document.getElementById('binary-rain');
      if (!binaryRain) return;

      // Clear existing characters
      binaryRain.innerHTML = '';

      for (let i = 0; i < 50; i++) {
        const char = document.createElement('div');
        char.className = 'binary-char';
        char.textContent = Math.random() > 0.5 ? '1' : '0';

        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 5;

        char.style.left = `${left}%`;
        char.style.animationDuration = `${duration}s`;
        char.style.animationDelay = `${delay}s`;
        char.style.opacity = (Math.random() * 0.5 + 0.1).toString();

        binaryRain.appendChild(char);
      }
    };

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href')!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    // Initialize binary rain
    createBinaryRain();

    // Recreate binary rain periodically
    const binaryInterval = setInterval(createBinaryRain, 10000);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      clearInterval(binaryInterval);
    };
  }, []);

  return null; // This component only handles effects, no UI
}