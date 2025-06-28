"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'subtle'
  hover?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: GlassCardProps) {
  const variants = {
    default: 'glass',
    strong: 'glass-strong',
    subtle: 'glass-subtle'
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl transition-all duration-300 will-change-transform',
        variants[variant],
        hover && 'hover:bg-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-violet-500/20',
        className
      )}
      whileHover={hover ? { 
        y: -5,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
      } : undefined}
      layout
    >
      {children}
    </motion.div>
  )
}