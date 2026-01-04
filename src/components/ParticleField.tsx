import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const ParticleField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; id: number }[] = [];
    for (let i = 0; i < 15; i++) {
      lines.push({
        id: i,
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
      });
    }
    return lines;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, hsl(222 47% 8%) 0%, hsl(222 47% 3%) 100%)' }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(190 100% 50%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(190 100% 50%) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((line) => (
          <motion.line
            key={line.id}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke="hsl(190 100% 50% / 0.1)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.3, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: line.id * 0.5,
              ease: 'linear',
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 3 === 0 ? 'hsl(142 76% 50%)' : 'hsl(190 100% 50%)',
            boxShadow: `0 0 ${particle.size * 2}px ${
              particle.id % 3 === 0 ? 'hsl(142 76% 50% / 0.5)' : 'hsl(190 100% 50% / 0.5)'
            }`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Large glowing orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(190 100% 50% / 0.3) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(142 76% 50% / 0.3) 0%, transparent 70%)',
          right: '15%',
          bottom: '30%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
};

export default ParticleField;
