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
        'rounded-xl transition-all duration-300',
        variants[variant],
        hover && 'hover:bg-white/10 hover:border-white/30 hover:shadow-2xl hover:shadow-violet-500/20',
        className
      )}
      whileHover={hover ? { y: -5 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}