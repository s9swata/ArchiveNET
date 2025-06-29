"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  position?: 'top-left' | 'top-right' | 'full';
}

export const FloatingParticles = ({ count = 25, className = "", position = 'full' }: FloatingParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Color palette for particles
  const colors = [
    "rgba(59, 130, 246, 0.4)",   // Blue
    "rgba(147, 197, 253, 0.3)",  // Light Blue
    "rgba(255, 255, 255, 0.2)",  // White
    "rgba(139, 92, 246, 0.3)",   // Purple
    "rgba(34, 197, 94, 0.3)",    // Green
    "rgba(251, 191, 36, 0.3)",   // Yellow
  ];

  useEffect(() => {
    // Set dimensions on mount and resize
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Generate particles based on position
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      let x, y;
      
      switch (position) {
        case 'top-left':
          x = Math.random() * (dimensions.width * 0.4); // Left 40% of screen
          y = Math.random() * (dimensions.height * 0.5); // Top 50% of screen
          break;
        case 'top-right':
          x = dimensions.width * 0.6 + Math.random() * (dimensions.width * 0.4); // Right 40% of screen
          y = Math.random() * (dimensions.height * 0.5); // Top 50% of screen
          break;
        default:
          x = Math.random() * dimensions.width;
          y = Math.random() * dimensions.height;
      }

      return {
        id: i,
        x,
        y,
        size: Math.random() * 6 + 2, // 2-8px
        opacity: Math.random() * 0.7 + 0.2, // 0.2-0.9
        duration: Math.random() * 25 + 15, // 15-40 seconds
        delay: Math.random() * 8, // 0-8 seconds delay
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    setParticles(newParticles);
  }, [count, dimensions, position, colors]);

  if (particles.length === 0) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 100 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            zIndex: 100,
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: [
              particle.x,
              particle.x + (Math.random() - 0.5) * 150,
              particle.x + (Math.random() - 0.5) * 200,
              particle.x,
            ],
            y: [
              particle.y,
              particle.y + (Math.random() - 0.5) * 100,
              particle.y + (Math.random() - 0.5) * 150,
              particle.y,
            ],
            opacity: [0, particle.opacity, particle.opacity, 0],
            scale: [0, 1, 1.3, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Specialized component for hero section with corner positioning
export const HeroFloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 100 }}>
      {/* Top Left Corner Particles */}
      <FloatingParticles count={20} position="top-left" className="z-[100]" />
      
      {/* Top Right Corner Particles */}
      <FloatingParticles count={20} position="top-right" className="z-[100]" />
      
      {/* Enhanced detail particles for corners */}
      <div className="absolute inset-0" style={{ zIndex: 100 }}>
        {/* Top Left Detail Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`detail-left-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 35}%`, // Left 35% of screen
              top: `${Math.random() * 40}%`, // Top 40% of screen
              backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`,
              zIndex: 100,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.5, 1.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Top Right Detail Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`detail-right-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${65 + Math.random() * 35}%`, // Right 35% of screen
              top: `${Math.random() * 40}%`, // Top 40% of screen
              backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`,
              zIndex: 100,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.5, 1.8, 0.5],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced glowing orbs for corners */}
      <div className="absolute inset-0" style={{ zIndex: 100 }}>
        {/* Top Left Glowing Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-left-${i}`}
            className="absolute rounded-full blur-sm"
            style={{
              width: Math.random() * 25 + 15,
              height: Math.random() * 25 + 15,
              left: `${Math.random() * 30}%`, // Left 30% of screen
              top: `${Math.random() * 35}%`, // Top 35% of screen
              backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`,
              zIndex: 100,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 60 - 30],
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 18 + 12,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Top Right Glowing Orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-right-${i}`}
            className="absolute rounded-full blur-sm"
            style={{
              width: Math.random() * 25 + 15,
              height: Math.random() * 25 + 15,
              left: `${70 + Math.random() * 30}%`, // Right 30% of screen
              top: `${Math.random() * 35}%`, // Top 35% of screen
              backgroundColor: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`,
              zIndex: 100,
            }}
            animate={{
              x: [0, Math.random() * 80 - 40],
              y: [0, Math.random() * 60 - 30],
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 18 + 12,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Shooting stars from corners */}
      <div className="absolute inset-0" style={{ zIndex: 100 }}>
        {/* From Top Left */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`star-left-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 20}%`,
              top: `${Math.random() * 25}%`,
              zIndex: 100,
            }}
            animate={{
              x: [0, 150],
              y: [0, 75],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: Math.random() * 12 + 6,
              ease: "easeOut",
            }}
          />
        ))}

        {/* From Top Right */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`star-right-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${80 + Math.random() * 20}%`,
              top: `${Math.random() * 25}%`,
              zIndex: 100,
            }}
            animate={{
              x: [0, -150],
              y: [0, 75],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: Math.random() * 12 + 6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Constellation lines connecting corners */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 100 }}>
        {[...Array(4)].map((_, i) => (
          <motion.line
            key={`line-corner-${i}`}
            x1={`${Math.random() * 25}%`}
            y1={`${Math.random() * 30}%`}
            x2={`${75 + Math.random() * 25}%`}
            y2={`${Math.random() * 30}%`}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.4, 0] 
            }}
            transition={{
              duration: Math.random() * 10 + 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};