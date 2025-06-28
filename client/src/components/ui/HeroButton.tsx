"use client";
import React from "react";
import { HoverBorderGradient } from "../ui/hover-border-gradient";
import Image from "next/image";
import archiveNetLogo from "../../../public/icons/cropped_logo.jpeg";

export function HeroButton({ onClick }: { onClick?: () => void }) {
    return (
        <div className="m-20 flex justify-center text-center">
            <HoverBorderGradient
                containerClassName="rounded-full"
                as="button"
                className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 cursor-pointer"
                onClick={onClick}
            >
                <Image src={archiveNetLogo.src} alt="ArchiveNET Logo" width={40} height={40} className="rounded-full" />
                <span className="text-sm font-[semiBold]">Get Started Today</span>
            </HoverBorderGradient>
        </div>
    );
}
