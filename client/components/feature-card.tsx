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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard className="p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg glass-strong">
              <Icon className="w-6 h-6 text-violet-400" />
            </div>
            {badge && (
              <Badge variant="glass" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          
          <h3 className="text-xl font-semibold mb-3 text-white">
            {title}
          </h3>
          
          <p className="text-gray-300 leading-relaxed flex-grow">
            {description}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
}