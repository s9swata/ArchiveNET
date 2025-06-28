"use client"

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { GlassCard } from './glass-card'
import { Badge } from './ui/badge'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  delay?: number
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  badge,
  delay = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <GlassCard className="p-6 h-full group">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="p-3 rounded-lg glass-strong group-hover:bg-white/15 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-6 h-6 text-violet-400" />
            </motion.div>
            {badge && (
              <Badge variant="glass" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-violet-100 transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed flex-grow group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
}