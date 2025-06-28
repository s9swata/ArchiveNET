"use client";
import { NavBar } from "./NavBar";
import background from "../../../public/pictures/blackhole.png"
import Image from "next/image";
import Paragraph from './Character';
import Marquee from "./Marquee";
import { BentoGridDemo } from "./BentoGrid";
import { Subscriptions } from "./Subscriptions";
import { HeroButton } from "../ui/HeroButton";
import { useRouter } from "next/navigation";

// #TODO: Make this mobile responsive

export const Landing = () => {
    const router = useRouter();
    return (
        <>
            <div className="w-full bg-black h-screen">
                <Image src={background} alt="Background" className="absolute inset-0 object-cover w-full h-full z-10 opacity-80" />
                <NavBar />
            </div>
            <div className="absolute top-1/3 w-screen px-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[Black] text-white tracking-[8px] sm:tracking-[15px] md:tracking-[20px] lg:tracking-[30px] xl:tracking-[35px] text-center drop-shadow-xl">ARCHIVENET</h1>
            </div>
            <div className="z-20 absolute bottom-0 left-0 p-4 max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%]">
                <div>
                    <h1 className="font-[Black] text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl">WORLD&apos;S FIRST DECENTRALIZED PROTOCOL FOR AGENTIC MODELS</h1>
                    <h2 className="font-[semiBold] text-white text-sm sm:text-base md:text-[18px] mt-3 sm:mt-4 md:mt-5">Introducing the world&apos;s first decentralized protocol for Agentic Models — a trustless, scalable framework that lets AI agents access, store, and manage context securely across networks. Built for interoperability, privacy, and permanence</h2>
                </div>
            </div>

            {/* Lower right corner div */}
            <div className="hidden md:flex absolute bottom-10 right-0 p-4 flex-row space-x-4 max-w-[40vh]">
                <div className="flex flex-col justify-between">
                    <h1 className="text-lg lg:text-xl font-[Black] text-white">On-Chain Vector Engine</h1>
                    <h2 className="text-xs font-[semiBold] text-white mt-5">Enables secure, decentralized storage and retrieval of vector embeddings directly on the blockchain for trustless AI computation.
                    </h2>
                </div>
                <div className="flex flex-col justify-between">
                    <h1 className="text-lg lg:text-xl font-[Black] text-white">Universal Memory Context</h1>
                    <h2 className="text-xs font-[semiBold] text-white mt-5">Persistent, cross-agent memory for LLMs—ensuring continuity, personalization, and shared understanding across interactions.
                    </h2>
                </div>
            </div>
            <div className="bg-black pt-10 sm:pt-15 md:pt-20 px-4 sm:px-6 md:px-10 flex justify-center items-center overflow-x-hidden">
                <Marquee />
            </div>
            <div className="my-5 sm:my-7 md:my-10 dark">
                <BentoGridDemo />
            </div>
            <div className='w-full bg-black'>
                <Paragraph value={"Take the first :smirk_cat: step towards secure :smile:, universal memory for agentic models :sunglasses: , unlock shared context and scalable :brain: intelligence"} style={"w-full px-4 sm:px-10 md:px-20 lg:px-30 pt-10 sm:pt-15 md:pt-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[semiBold] text-[#dfdcff] text-center"}>
                </Paragraph>
            </div>
            <div className="my-10 sm:my-15 md:my-20">
                <Subscriptions />
            </div>
            <div className="dark">
                <HeroButton onClick={() => router.push('/get-started')} />
            </div>
        </>
    )
}