import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
    IconClipboardCopy,
    IconFileBroken,
    IconSignature,
    IconTableColumn,
} from "@tabler/icons-react";
import Image from "next/image";
import earth from "../../../public/pictures/earth.png";
import data from "../../../public/pictures/data.png";
import brain from "../../../public/pictures/brain2.jpg";
import graph from "../../../public/pictures/graph.png";

export function BentoGridDemo() {
    return (
        <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[28rem]">
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    className={item.className}
                    icon={item.icon}
                    image={item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            width={200}
                            height={200}
                            className={item.title === "On-Chain Context Layer" ? "flex justify-center object-cover ml-6" : (item.title === "No Corporate Databases" ? "w-full overflow-hidden object-cover" : "w-full h-48 object-cover rounded-lg")}
                        />
                    ) : <></>}
                />
            ))}
        </BentoGrid>
    );
}

const items = [
    {
        title: "The Universal Context",
        description: "Explore the concept of a shared memory for AI agents.",
        className: "md:col-span-2",
        icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
        image: earth,
    },
    {
        title: "You Own Your Data",
        description: "Learn how to maintain control over your data in AI systems.",
        className: "md:col-span-1",
        icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
        image: data,
    },
    {
        title: "On-Chain Context Layer",
        description: "Every interaction, observation, and update from AI agents is stored immutably on-chain, enabling persistent and tamper-proof memory.",
        className: "md:col-span-1",
        icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
        image: brain,
    },
    {
        title: "No Corporate Databases",
        description:
            "Say goodbye to centralized databases and hello to a decentralized, trustless system for AI agents.",
        className: "md:col-span-2",
        icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
        image: graph,
    },
];
