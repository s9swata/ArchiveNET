import React from "react";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function TextHoverEffectDemo() {
    return (
        <div className="absolute z-20 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TextHoverEffect text="ARCHIVENET" duration={300} />
        </div>
    );
}
