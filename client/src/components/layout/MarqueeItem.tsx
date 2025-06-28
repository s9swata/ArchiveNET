"use client";

import React from "react";
import { motion } from "framer-motion";

interface MarqueeItemProps {
    images: string[];
    from: string;
    to: string;
}

const MarqueeItem = ({ images, from, to }: MarqueeItemProps) => {
    return (
        <div className="flex MyGradient bg-black">
            <motion.div
                initial={{ x: `${from}` }}
                animate={{ x: `${to}` }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="flex flex-shrink-0"
            >
                {images.map((image: string, index: number) => {
                    return <img className="h-40 w-56 pr-20" src={image} key={index} />;
                })}
            </motion.div>

            <motion.div
                initial={{ x: `${from}` }}
                animate={{ x: `${to}` }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="flex flex-shrink-0"
            >
                {images.map((image: string, index: number) => {
                    return <img className="h-40 w-56 pr-20" src={image} key={index} />;
                })}
            </motion.div>
        </div>
    );
};

export default MarqueeItem;