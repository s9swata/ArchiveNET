"use client"

import { motion } from 'framer-motion'
import { 
  Brain, 
  Search, 
  Database, 
  Zap, 
  Shield, 
  Cpu,
  ArrowRight,
  Github,
  ExternalLink,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/glass-card'
import { FeatureCard } from '@/components/feature-card'
import { AnimatedText } from '@/components/animated-text'
import { Particles } from '@/components/particles'

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Context Storage",
      description: "Store personal and professional information with rich metadata, tags, and automatic timestamping for perfect organization.",
      badge: "AI-Powered"
    },
    {
      icon: Search,
      title: "Vector Search",
      description: "Find relevant context using advanced vector similarity search with configurable relevance scoring and filtering.",
      badge: "Fast"
    },
    {
      icon: Database,
      title: "Multi-LLM Support",
      description: "Seamlessly integrate with Claude Desktop and Cursor IDE through the Model Context Protocol.",
      badge: "Universal"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Optional Bearer token authentication and configurable API endpoints ensure your data stays secure.",
      badge: "Secure"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Instant context insertion and retrieval with comprehensive error handling and validation.",
      badge: "Instant"
    },
    {
      icon: Cpu,
      title: "TypeScript Native",
      description: "Built with full TypeScript support, Zod validation, and modern development practices.",
      badge: "Type-Safe"
    }
  ]

  const stats = [
    { label: "Context Items", value: "10K+", description: "Stored securely" },
    { label: "Search Speed", value: "<100ms", description: "Average response" },
    { label: "Accuracy", value: "99.9%", description: "Vector matching" },
    { label: "Uptime", value: "99.99%", description: "Service reliability" }
  ]

  return (
    <main className="relative overflow-hidden">
      <Particles />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge variant="glass" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Model Context Protocol
            </Badge>
          </motion.div>

          <AnimatedText
            text="Intelligent Context Management for AI Assistants"
            className="text-5xl md:text-7xl font-bold mb-6"
            gradient={true}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Store, search, and retrieve personal and professional context data 
            with advanced vector search and seamless AI integration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button variant="glow" size="xl" className="group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="glass" size="xl" className="group">
              <Github className="mr-2 w-5 h-5" />
              View on GitHub
              <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-20"
          >
            <GlassCard className="p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white font-medium mb-1">
                      {stat.label}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {stat.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-violet-500/20 blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage AI context data efficiently and securely
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple setup, powerful results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-strong flex items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Configure Endpoints
                </h3>
                <p className="text-gray-300">
                  Set up your API endpoints and authentication tokens using our interactive configuration tool.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-strong flex items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Connect AI Assistant
                </h3>
                <p className="text-gray-300">
                  Integrate with Claude Desktop or Cursor IDE using our automated setup scripts.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 text-center h-full">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-strong flex items-center justify-center">
                  <span className="text-2xl font-bold gradient-text">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Start Using
                </h3>
                <p className="text-gray-300">
                  Begin storing and retrieving context data seamlessly through your AI assistant.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Ready to Get Started?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Transform how your AI assistant manages context data. 
                Set up ArchiveNet in minutes and experience the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="glow" size="xl" className="group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button variant="glass" size="xl">
                  View Documentation
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold gradient-text">ArchiveNet</h3>
              <p className="text-gray-400 mt-2">
                Intelligent context management for AI assistants
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
              <Button variant="ghost" size="sm">
                Support
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>&copy; 2025 ArchiveNet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}