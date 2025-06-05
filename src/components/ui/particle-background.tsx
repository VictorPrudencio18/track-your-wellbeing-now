
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

export function ParticleBackground({ 
  density = 'medium', 
  color = '#f59e0b',
  className 
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particleCount = {
    low: 30,
    medium: 50,
    high: 80,
  }[density];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Fade in and out
        if (this.life < this.maxLife * 0.1) {
          this.opacity = (this.life / (this.maxLife * 0.1)) * 0.5;
        } else if (this.life > this.maxLife * 0.9) {
          this.opacity = ((this.maxLife - this.life) / (this.maxLife * 0.1)) * 0.5;
        }

        // Wrap around edges
        if (this.x < 0) this.x = canvas.offsetWidth;
        if (this.x > canvas.offsetWidth) this.x = 0;
        if (this.y < 0) this.y = canvas.offsetHeight;
        if (this.y > canvas.offsetHeight) this.y = 0;

        // Reset particle if life is over
        if (this.life >= this.maxLife) {
          this.x = Math.random() * canvas.offsetWidth;
          this.y = Math.random() * canvas.offsetHeight;
          this.life = 0;
          this.maxLife = Math.random() * 300 + 200;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [particleCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
}
