"use client";
import { NavBar } from "./NavBar";
import background from "../../../public/pictures/blackhole.png"
import Image from "next/image";
import Paragraph from './Character';
import Marquee from "./Marquee";
import { BentoGridDemo } from "./BentoGrid";
import { Subscriptions } from "./Subscriptions";
import { HeroButton } from "../ui/HeroButton";
import { Footer } from "./Footer";
import { useRouter } from "next/navigation";
import { WhyChooseArchiveNet } from "./WhyChoose";
import { GlassBadge } from "../ui/GlassBadge";
import { HeroFloatingParticles } from "../ui/FloatingParticles";

export const Landing = () => {
    const router = useRouter();
    return (
        <>
            {/* Hero Section */}
            <div className="w-full bg-black min-h-screen relative overflow-hidden">
                <Image 
                    src={background} 
                    alt="Background" 
                    className="absolute inset-0 object-cover w-full h-full z-10 opacity-80" 
                    priority
                />
                
                {/* Floating Particles - Hidden on mobile for performance */}
                <div className="hidden md:block">
                    <HeroFloatingParticles />
                </div>
                
                <NavBar />
                
                {/* Glass Badge - Responsive positioning */}
                <div className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-30 px-4">
                    <GlassBadge 
                        text="Get Universal Context Now!" 
                        emoji="🚀"
                    />
                </div>

                {/* Main Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 px-4 sm:px-6 lg:px-8">
                    {/* Main Title */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-[Black] text-white tracking-[4px] sm:tracking-[8px] md:tracking-[15px] lg:tracking-[25px] xl:tracking-[35px] drop-shadow-xl leading-tight">
                            ARCHIVENET
                        </h1>
                    </div>

                    {/* Hero Description */}
                    <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-[Black] text-white leading-tight">
                            WORLD'S FIRST DECENTRALIZED PROTOCOL FOR AGENTIC MODELS
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-[semiBold] text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Introducing the world's first decentralized protocol for Agentic Models — a trustless, 
                            scalable framework that lets AI agents access, store, and manage context securely across networks. 
                            Built for interoperability, privacy, and permanence.
                        </p>
                    </div>
                </div>
            </div>

            {/* Marquee Section */}
            <div className="bg-black pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8 lg:px-10 flex justify-center items-center overflow-hidden">
                <Marquee />
            </div>

            {/* Why Choose ArchiveNet Section */}
            <section id="why-choose">
                <WhyChooseArchiveNet />
            </section>

            {/* Features Section - BentoGrid */}
            <section id="features" className="my-8 sm:my-10 md:my-12 lg:my-16 px-4 sm:px-6 lg:px-8 dark">
                <BentoGridDemo />
            </section>

            {/* Animated Text Section */}
            <div className='w-full bg-black px-4 sm:px-6 lg:px-8'>
                <Paragraph 
                    value={"Take the first :smirk_cat: step towards secure :smile:, universal memory for agentic models :sunglasses: , unlock shared context and scalable :brain: intelligence"} 
                    style={"w-full pt-8 sm:pt-12 md:pt-16 lg:pt-20 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-[semiBold] text-[#dfdcff] text-center leading-tight"}
                />
            </div>

            {/* Pricing Section */}
            <section id="pricing" className="my-8 sm:my-12 md:my-16 lg:my-20 px-4 sm:px-6 lg:px-8">
                <Subscriptions />
            </section>

            {/* CTA Button */}
            <div className="dark px-4 sm:px-6 lg:px-8">
                <HeroButton onClick={() => router.push('/get-started')} />
            </div>

            {/* Footer Section */}
            <section id="contact">
                <Footer />
            </section>
        </>
    )
}