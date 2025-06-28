"use client";

import { Box, Lock, Settings } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Badge } from "@/components/ui/badge";
import DynamicButton from "@/components/ui/DynamicButton";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const plans = [
    {
        title: "Basic",
        featureTitle: "Perfect for individuals",
        features: [
            "Store up to 1,000 memories",
            "Create and manage 5 AI agents",
            "Get email-based support",
            "Ideal for students, hobbyists, or early testers"
        ],
        price: "$5",
        recommended: false
    },
    {
        "title": "Pro",
        "featureTitle": "Built for power users and growing teams",
        "features": [
            "Store up to 10,000 memories",
            "Unlimited AI agents",
            "Priority support",
            "Great for startups, researchers, and productivity hackers"
        ],
        "price": "$15",
        recommended: true
    },
    {
        "title": "Enterprise",
        "featureTitle": "Tailored for businesses and organizations",
        "features": [
            "Unlimited memory capacity",
            "Team collaboration tools",
            "Dedicated support",
            "Built for scale, reliability, and premium experience"
        ],
        "price": "$50",
        recommended: false
    }
]

export function Subscriptions({ currentPlan }: { currentPlan?: string }) {
    const getIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Box className="h-4 w-4 text-neutral-400" />;
            case 1:
                return <Settings className="h-4 w-4 text-neutral-400" />;
            case 2:
                return <Lock className="h-4 w-4 text-neutral-400" />;
            default:
                return <Box className="h-4 w-4 text-neutral-400" />;
        }
    };
    const router = useRouter();

    return (
        <>
            <h1 className="w-full text-center mt-10 text-3xl font-[semiBold] text-white">Choose the right plan that suits your needs</h1>
            <h2 className="w-full text-center mt-2 text-lg font-[Regular] text-neutral-400">
                Decentralized memory protocol for agentic LLMs. Scalable. Secure.
            </h2>
            <div className="max-w-screen flex flex-col md:flex-row lg:gap-12 xl:max-h-[34rem] mx-10 mt-10">
                {plans.map((plan, index) => (
                    <SubscriptionCard
                        key={plan.title}
                        area=""
                        icon={getIcon(index)}
                        title={plan.title}
                        onClick={() => router.push(`/payments?subscription=${plan.title.toLocaleLowerCase()}`)}
                        description={
                            <div>
                                <div className="text-5xl font-bold mb-2 text-blue-400">{plan.price}<span className="text-sm font-normal">/month</span></div>
                                <ul className="space-y-1">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="text-sm">• {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        }
                        currentPlan={currentPlan === plan.title.toLocaleLowerCase() ? true : false}
                        recommended={plan.recommended}
                    />
                ))}
            </div>
        </>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
    currentPlan?: boolean;
    recommended?: boolean;
    onClick?: () => void;
}

const SubscriptionCard = ({ area, icon, title, description, currentPlan, recommended, onClick }: GridItemProps) => {
    const pathname = usePathname();
    return (
        <li className={`min-h-[14rem] flex-1 list-none ${area}`.trim()}>
            <div className="relative h-full rounded-2xl border border-gray-600/30 p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                <div className="border-0.75 relative flex h-full flex-col justify-center overflow-hidden rounded-xl p-6 md:p-6 shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="relative flex flex-1 flex-col justify-between">
                        <div className="flex flex-row justify-between">
                            <div className="w-fit rounded-lg border border-gray-600 p-2">
                                {icon}
                            </div>
                            {recommended ? (<Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">Popular</Badge>) : <></>}
                        </div>
                        <div className="space-y-3">
                            <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] mt-4">
                                {title}
                            </h3>
                            <h2 className="font-sans text-sm/[1.125rem] md:text-base/[1.375rem] text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                                {description}
                            </h2>
                        </div>
                        {pathname === "/" || pathname === "" ? (<></>) : (<div className="mt-4">
                            {currentPlan ? (<Button variant="default" className="bg-blue-500 text-white w-full p-2 text-sm">Current Plan</Button>) : (<DynamicButton title={"Proceed to Checkout"} emoji={"🤟"} onClick={onClick} />)}
                        </div>)}

                    </div>
                </div>
            </div>
        </li>
    );
};
