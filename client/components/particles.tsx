"use client"

import { useEffect, useState, useMemo } from 'react'

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  size: number
}

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([])

  const particleData = useMemo(() => {
    const particleCount = 50
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 10,
        size: 1 + Math.random() * 2,
      })
    }

    return newParticles
  }, [])

  useEffect(() => {
    setParticles(particleData)
  }, [particleData])

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  )
}