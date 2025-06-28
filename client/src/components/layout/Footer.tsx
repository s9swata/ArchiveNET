"use client";
import { motion } from "framer-motion";
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Image from "next/image";
import logo from "../../../public/icons/cropped_logo.jpeg";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "Documentation", href: "#docs" },
            { name: "API Reference", href: "#api" },
        ],
        company: [
            { name: "About Us", href: "#about" },
            { name: "Blog", href: "#blog" },
            { name: "Careers", href: "#careers" },
            { name: "Contact", href: "#contact" },
        ],
        resources: [
            { name: "Community", href: "#community" },
            { name: "Support", href: "#support" },
            { name: "Status", href: "#status" },
            { name: "Changelog", href: "#changelog" },
        ],
        legal: [
            { name: "Privacy Policy", href: "#privacy" },
            { name: "Terms of Service", href: "#terms" },
            { name: "Cookie Policy", href: "#cookies" },
            { name: "GDPR", href: "#gdpr" },
        ],
    };

    const socialLinks = [
        { icon: IconBrandGithub, href: "#github", label: "GitHub" },
        { icon: IconBrandTwitter, href: "#twitter", label: "Twitter" },
        { icon: IconBrandLinkedin, href: "#linkedin", label: "LinkedIn" },
        { icon: IconMail, href: "mailto:contact@archivenet.com", label: "Email" },
    ];

    return (
        <footer className="relative bg-black border-t border-white/10 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)]" />
            
            {/* Glassmorphism Container */}
            <div className="relative backdrop-blur-xl bg-black/30 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Footer Content */}
                    <div className="py-12 lg:py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                            {/* Brand Section */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    {/* Logo */}
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={logo}
                                            alt="ArchiveNET Logo"
                                            width={48}
                                            height={48}
                                            className="rounded-lg"
                                        />
                                        <span className="text-2xl font-[Black] text-white tracking-wider">
                                            ARCHIVENET
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-400 font-[Regular] text-sm leading-relaxed max-w-md">
                                        World's first decentralized protocol for Agentic Models — a trustless, 
                                        scalable framework that lets AI agents access, store, and manage context 
                                        securely across networks.
                                    </p>

                                    {/* Contact Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3 text-gray-400 text-sm">
                                            <IconMapPin className="w-4 h-4 text-violet-400" />
                                            <span>San Francisco, CA</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-400 text-sm">
                                            <IconPhone className="w-4 h-4 text-violet-400" />
                                            <span>+1 (555) 123-4567</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-gray-400 text-sm">
                                            <IconMail className="w-4 h-4 text-violet-400" />
                                            <span>contact@archivenet.com</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Links Sections */}
                            <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                                {/* Product */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-white font-[semiBold] text-sm uppercase tracking-wider">
                                        Product
                                    </h3>
                                    <ul className="space-y-3">
                                        {footerLinks.product.map((link, index) => (
                                            <li key={index}>
                                                <a
                                                    href={link.href}
                                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-[Regular]"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Company */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-white font-[semiBold] text-sm uppercase tracking-wider">
                                        Company
                                    </h3>
                                    <ul className="space-y-3">
                                        {footerLinks.company.map((link, index) => (
                                            <li key={index}>
                                                <a
                                                    href={link.href}
                                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-[Regular]"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Resources */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-white font-[semiBold] text-sm uppercase tracking-wider">
                                        Resources
                                    </h3>
                                    <ul className="space-y-3">
                                        {footerLinks.resources.map((link, index) => (
                                            <li key={index}>
                                                <a
                                                    href={link.href}
                                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-[Regular]"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Legal */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-white font-[semiBold] text-sm uppercase tracking-wider">
                                        Legal
                                    </h3>
                                    <ul className="space-y-3">
                                        {footerLinks.legal.map((link, index) => (
                                            <li key={index}>
                                                <a
                                                    href={link.href}
                                                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-[Regular]"
                                                >
                                                    {link.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="py-8 border-t border-white/10"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                            <div className="max-w-md">
                                <h3 className="text-white font-[semiBold] text-lg mb-2">
                                    Stay Updated
                                </h3>
                                <p className="text-gray-400 text-sm font-[Regular]">
                                    Get the latest updates on ArchiveNET development and releases.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 max-w-md w-full lg:w-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent backdrop-blur-sm font-[Regular] text-sm"
                                />
                                <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-[semiBold] text-sm whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="py-8 border-t border-white/10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
                            {/* Copyright */}
                            <div className="text-gray-400 text-sm font-[Regular]">
                                © {currentYear} ArchiveNET. All rights reserved.
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center space-x-6">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        </footer>
    );
};