import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
  pulseSpeed: number;
  orbitRadius: number;
  angle: number;
  orbitSpeed: number;
}

export const TimeTravelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create particles for the temporal vortex
    const particleCount = Math.min(85, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    const centerX = width * 0.45;
    const centerY = height * 0.4;

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * (Math.max(width, height) * 0.65);
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() > 0.4 ? 42 : 155, // Gold/brass (42) or emerald (155)
        pulseSpeed: Math.random() * 0.02 + 0.005,
        orbitRadius: radius,
        angle: angle,
        orbitSpeed: (0.0008 + Math.random() * 0.0012) * (Math.random() > 0.5 ? 1 : -1)
      });
    }

    let clockAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Temporal vortex backdrop
      const radialGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        Math.max(width, height) * 0.8
      );
      radialGradient.addColorStop(0, 'rgba(27, 90, 67, 0.22)');
      radialGradient.addColorStop(0.35, 'rgba(10, 28, 22, 0.6)');
      radialGradient.addColorStop(0.7, 'rgba(6, 14, 11, 0.95)');
      radialGradient.addColorStop(1, '#050B09');

      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, width, height);

      // Rotating Chrono-Astrolabe Rings (Vintage Chronometer Graphics)
      clockAngle += 0.0015;
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer chronometer ring
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(227, 169, 59, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();

      // Middle chronometer ring with counter-rotation
      ctx.save();
      ctx.rotate(-clockAngle * 1.5);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(111, 211, 160, 0.14)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 12]);
      ctx.stroke();

      // Astrolabe ticks
      const ticks = 24;
      for (let t = 0; t < ticks; t++) {
        const rad = (t * Math.PI * 2) / ticks;
        const r1 = Math.min(width, height) * 0.29;
        const r2 = Math.min(width, height) * (t % 6 === 0 ? 0.32 : 0.305);
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * r1, Math.sin(rad) * r1);
        ctx.lineTo(Math.cos(rad) * r2, Math.sin(rad) * r2);
        ctx.strokeStyle = t % 6 === 0 ? 'rgba(227, 169, 59, 0.25)' : 'rgba(111, 211, 160, 0.15)';
        ctx.lineWidth = t % 6 === 0 ? 1.5 : 1;
        ctx.setLineDash([]);
        ctx.stroke();
      }
      ctx.restore();

      // Inner fast gear ring
      ctx.save();
      ctx.rotate(clockAngle * 2.2);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(243, 194, 93, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 18]);
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Draw and animate particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.orbitSpeed;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.01;
        if (p.opacity < 0.1) p.opacity = 0.1;
        if (p.opacity > 0.8) p.opacity = 0.8;

        const currentX = centerX + Math.cos(p.angle) * p.orbitRadius;
        const currentY = centerY + Math.sin(p.angle) * p.orbitRadius;

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 42
            ? `rgba(243, 194, 93, ${p.opacity})`
            : `rgba(111, 211, 160, ${p.opacity * 0.9})`;
        ctx.shadowColor = p.hue === 42 ? 'rgba(227, 169, 59, 0.4)' : 'rgba(111, 211, 160, 0.3)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
      {/* Decorative Temporal Grid & Floating Coordinate HUD */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #6FD3A0 1px, transparent 1px),
            linear-gradient(to bottom, #6FD3A0 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cust-green/10 blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-1/3 right-1/4 w-[420px] h-[420px] rounded-full bg-cust-brass/10 blur-3xl pointer-events-none animate-pulse duration-[10000ms]" />
    </div>
  );
};
