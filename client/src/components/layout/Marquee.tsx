"use client";

import React from "react";
import MarqueeItem from "./MarqueeItem";

const Marquee = () => {
    const upperMarquee = [
        "/pictures/openAI.svg",
        "/pictures/claude.svg",
        "/pictures/gemini.svg",
        "/pictures/grok.svg",
        "/pictures/llama.svg",
        "/pictures/deepseek.svg",
    ];

    const lowerMarquee = [
        "/pictures/openAI.svg",
        "/pictures/claude.svg",
        "/pictures/gemini.svg",
        "/pictures/grok.svg",
        "/pictures/llama.svg",
        "/pictures/deepseek.svg",
    ];

    return (
        <div className=" bg-black">
            <MarqueeItem images={upperMarquee} from={"0"} to={"-100%"} />
            <MarqueeItem images={lowerMarquee} from={"-100%"} to={"0"} />
        </div>
    );
};

export default Marquee;