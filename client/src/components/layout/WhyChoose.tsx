"use client";
import { motion } from "framer-motion";
import { IconShield, IconNetwork, IconBrain, IconCode, IconDatabase, IconLock } from "@tabler/icons-react";

export const WhyChooseArchiveNet = () => {
    const features = [
        {
            icon: <IconShield className="w-8 h-8 text-blue-400" />,
            title: "Decentralized Security",
            description: "Your data is secured across a distributed network, eliminating single points of failure and ensuring maximum protection."
        },
        {
            icon: <IconBrain className="w-8 h-8 text-purple-400" />,
            title: "AI-Native Architecture",
            description: "Built specifically for AI agents with optimized memory structures and context management for superior performance."
        },
        {
            icon: <IconNetwork className="w-8 h-8 text-green-400" />,
            title: "Universal Compatibility",
            description: "Works seamlessly with all major AI models and frameworks, providing a unified memory layer across platforms."
        },
        {
            icon: <IconDatabase className="w-8 h-8 text-orange-400" />,
            title: "Persistent Memory",
            description: "Never lose context again. Your AI agents maintain continuous memory across sessions and interactions."
        },
        {
            icon: <IconLock className="w-8 h-8 text-red-400" />,
            title: "Privacy First",
            description: "You own your data completely. No corporate databases, no data mining, just pure decentralized ownership."
        },
        {
            icon: <IconCode className="w-8 h-8 text-cyan-400" />,
            title: "Developer Friendly",
            description: "Simple APIs and comprehensive documentation make integration effortless for developers and researchers."
        }
    ];

    return (
        <section id="why-choose" className="relative py-20 sm:py-24 md:py-32 bg-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1),transparent_50%)]" />

            {/* Animated Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 lg:mb-20"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[Black] text-white mb-6 tracking-wider">
                        WHY CHOOSE
                    </h2>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[Black] text-blue-400 mb-8 tracking-wider">
                        ARCHIVENET?
                    </h3>
                    <p className="text-lg sm:text-xl text-gray-300 font-[Regular] max-w-3xl mx-auto leading-relaxed">
                        Experience the future of AI memory management with our revolutionary decentralized protocol
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            {/* Glassmorphism Card */}
                            <div className="relative h-full p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105 group-hover:border-white/20">
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

                                {/* Content */}
                                <div className="relative z-10 space-y-6">
                                    {/* Icon Container */}
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-xl sm:text-2xl font-[semiBold] text-white group-hover:text-blue-300 transition-colors duration-300">
                                        {feature.title}
                                    </h4>

                                    {/* Description */}
                                    <p className="text-gray-400 font-[Regular] leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 lg:mt-20"
                >
                    <div className="relative inline-block">
                        {/* Glassmorphism Container */}
                        <div className="relative px-8 py-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                            <p className="text-lg sm:text-xl text-white font-[semiBold] mb-4">
                                Ready to revolutionize your AI's memory?
                            </p>
                            <p className="text-gray-400 font-[Regular]">
                                Join thousands of developers building the future of decentralized AI
                            </p>
                        </div>

                        {/* Background Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-xl opacity-50" />
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </section>
    );
};