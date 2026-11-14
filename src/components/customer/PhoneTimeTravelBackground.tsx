import React, { useEffect, useRef } from 'react';

interface ChalkParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  color: string;
}

export const PhoneTimeTravelBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 390);
    const height = (canvas.height = 844);

    // Chalk dust particles
    const particles: ChalkParticle[] = [];
    const count = 38;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        speedY: -(Math.random() * 0.35 + 0.1),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.15,
        color: Math.random() > 0.6 ? '#FF8C42' : Math.random() > 0.5 ? '#88D49E' : '#E6E6E6'
      });
    }

    let chalkAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Chalkboard canvas fill
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(0, 0, width, height);

      // Subtle chalk grid
      ctx.strokeStyle = 'rgba(230, 230, 230, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Hand-Drawn Flowing Curved Data Line with Circular Nodes (as per Design Guide)
      ctx.save();
      chalkAngle += 0.002;
      ctx.strokeStyle = 'rgba(255, 140, 66, 0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(20, 260 + Math.sin(chalkAngle) * 20);
      ctx.bezierCurveTo(
        110, 200 + Math.cos(chalkAngle) * 30,
        240, 320 + Math.sin(chalkAngle * 1.2) * 25,
        370, 240 + Math.cos(chalkAngle) * 20
      );
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes on the curved line
      const nodes = [
        { x: 45, y: 255 + Math.sin(chalkAngle) * 18, color: '#FF8C42' },
        { x: 175, y: 250 + Math.sin(chalkAngle * 1.1) * 22, color: '#88D49E' },
        { x: 310, y: 275 + Math.cos(chalkAngle) * 15, color: '#FF8C42' }
      ];
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.strokeStyle = '#E6E6E6';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Hand-drawn sketch astrolabe loop in upper corner
      ctx.save();
      ctx.translate(width * 0.8, 120);
      ctx.rotate(chalkAngle * 0.8);
      ctx.strokeStyle = 'rgba(230, 230, 230, 0.12)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(136, 212, 158, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Chalk dust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-90" />

      {/* Floating handwritten chalkboard annotation pointer (as specified in Design Guide) */}
      <div className="absolute top-14 right-5 font-sketch text-[11px] text-[#FF8C42]/60 select-none pointer-events-none rotate-3">
        <span>↷ temporal loop active</span>
      </div>

      <div className="absolute bottom-20 left-6 font-sketch text-[10px] text-[#88D49E]/50 select-none pointer-events-none -rotate-2">
        <span>◎ chronometric mesh 0.04 ms</span>
      </div>
    </div>
  );
};
