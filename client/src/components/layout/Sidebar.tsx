"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, UserButton, useUser } from "@clerk/nextjs";
import {
    IconBrandTabler,
    IconCreditCard,
    IconChevronDown,
    IconChevronUp,
} from "@tabler/icons-react";
import { getInstances, getUserSubscription } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { SubscriptionManagement } from "./SubscriptionManagement";
import { OnboardingFlow } from "./OnboardingFlow";

interface Instance {
    id: string;
    name: string;
    createdAt?: string;
    lastUsedAt?: string;
}

interface UserSubscription {
    plan: string;
    isActive: boolean;
}

type ViewType = 'dashboard' | 'subscription' | 'onboarding';

export function SidebarDemo() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [instances, setInstances] = useState<Instance[]>([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [activeView, setActiveView] = useState<ViewType>('dashboard');
    const [expandedInstance, setExpandedInstance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleGetInstances = async () => {
            const token = await getToken();
            if (!token) {
                console.error("Token is not available, user might not be signed in");
                return;
            }
            const instancesData = await getInstances(token);
            console.log("Instances:", instancesData.data);
            setInstances(instancesData.data);
        }

        const fetchUserSubscription = async () => {
            try {
                const token = await getToken();
                if (!token) return;

                const subscriptionData = await getUserSubscription(token);
                if (!subscriptionData || !subscriptionData.data) {
                    console.error("No subscription data found");
                    setSubscription({ plan: "Free", isActive: false });
                    return;
                }
                console.log("User Subscription:", subscriptionData.data);
                setSubscription({ plan: subscriptionData.data.plan, isActive: subscriptionData.data.isActive });
            } catch (error) {
                console.error("Failed to fetch subscription:", error);
                setSubscription({ plan: "Free", isActive: false });
            }
        };

        const initializeData = async () => {
            setIsLoading(true);
            await handleGetInstances();
            await fetchUserSubscription();
            setIsLoading(false);
        };

        initializeData();
    }, [getToken]);

    // Determine which view to show based on user status
    useEffect(() => {
        if (!isLoading && subscription) {
            const hasActiveSubscription = subscription.isActive;
            const hasInstances = instances.length > 0;

            if (!hasActiveSubscription || !hasInstances) {
                setActiveView('onboarding');
            } else {
                setActiveView('dashboard');
            }
        }
    }, [subscription, instances, isLoading]);

    const links = [
        {
            label: "Onboarding",
            href: "#",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            onClick: () => setActiveView('onboarding'),
            disabled: subscription?.isActive && instances.length > 0,
        },
        {
            label: "Dashboard",
            href: "#",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            onClick: () => setActiveView('dashboard'),
            disabled: !subscription?.isActive || instances.length === 0,
        },
        {
            label: "Manage Subscription",
            href: "#",
            icon: (
                <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            onClick: () => setActiveView('subscription'),
            disabled: false,
        },
    ];

    const [open, setOpen] = useState(false);

    const getDisplayName = () => {
        if (user?.fullName) return user.fullName;
        if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
        if (user?.firstName) return user.firstName;
        return "User";
    };

    const getSubscriptionDisplay = () => {
        if (!subscription || !subscription.isActive) return "Free Plan";
        return subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
    };

    const toggleInstanceExpansion = (instanceId: string) => {
        setExpandedInstance(expandedInstance === instanceId ? null : instanceId);
    };

    const handleStepComplete = (step: number) => {
        if (step === 2) {
            // Handle instance creation
            console.log("Creating instance...");
            // This would trigger the instance creation API call
            // After successful creation, refresh the instances
        }
    };

    const getCurrentOnboardingStep = () => {
        if (!subscription?.isActive) return 1;
        if (instances.length === 0) return 2;
        return 3;
    };

    // Handle navigation from onboarding to subscription management
    const handleNavigateToSubscription = () => {
        setActiveView('subscription');
    };

    // Setup instructions for the dashboard
    const setupInstructions = `# Install ArchiveNET MCP globally
npm install -g @s9swata/archivenet-mcp

# Configure your environment
archivenet-edit-env --interactive

# Setup for your preferred LLM
archivenet-setup-mcp claude    # For Claude Desktop
archivenet-setup-mcp cursor    # For Cursor IDE

# Start using ArchiveNET
# Your MCP server is now ready!`;

    const renderMainContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            );
        }

        if (activeView === 'subscription') {
            return <SubscriptionManagement currentPlan={subscription?.plan} />;
        }

        if (activeView === 'onboarding') {
            return (
                <OnboardingFlow
                    currentStep={getCurrentOnboardingStep()}
                    hasSubscription={subscription?.isActive || false}
                    hasInstance={instances.length > 0}
                    onStepComplete={handleStepComplete}
                    onNavigateToSubscription={handleNavigateToSubscription}
                />
            );
        }

        // Dashboard view - only shown for subscribed users with instances
        return (
            <>
                {/* Project Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-[bold] mb-4 text-white">
                                Console Dashboard
                            </h1>
                            <h2 className="text-2xl font-[semiBold] mb-1 text-white">
                                Your Instances
                            </h2>
                            <p className="text-neutral-400">
                                Manage your ArchiveNet Instances
                            </p>
                        </div>
                    </div>
                </div>

                {/* Instances List */}
                <Card className="bg-neutral-800 border-neutral-700">
                    <CardContent>
                        <div className="space-y-3">
                            {instances && instances.length > 0 ? (
                                instances.map((instance) => (
                                    <div key={instance.id} className="rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors">
                                        {/* Instance Header */}
                                        <div
                                            className="flex items-center justify-between p-4 cursor-pointer"
                                            onClick={() => toggleInstanceExpansion(instance.id)}
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-white font-[semiBold]">Your ArchiveNET Instance</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-xs text-green-400">Online</span>
                                                    <span className="text-xs text-neutral-500">•</span>
                                                    <span className="text-xs text-neutral-400">
                                                        Created {instance.createdAt ? new Date(instance.createdAt).toLocaleDateString() : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm text-neutral-300">
                                                        Last used: {instance.lastUsedAt ? new Date(instance.lastUsedAt).toLocaleDateString() : 'Never'}
                                                    </p>
                                                </div>
                                                <div className="text-neutral-400">
                                                    {expandedInstance === instance.id ? (
                                                        <IconChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <IconChevronDown className="h-5 w-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Setup Instructions Section */}
                                        {expandedInstance === instance.id && (
                                            <div className="px-4 pb-4 border-t border-neutral-600/50">
                                                <div className="mt-4">
                                                    <h4 className="text-white font-[semiBold] mb-3 flex items-center gap-2">
                                                        <span className="text-blue-400">📋</span>
                                                        Setup Instructions
                                                    </h4>
                                                    <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-600/30">
                                                        <p className="text-neutral-300 text-sm mb-3">
                                                            Follow these steps to connect your instance to your development environment:
                                                        </p>
                                                        <CodeBlock
                                                            code={setupInstructions}
                                                            language="bash"
                                                            filename="setup-instructions.sh"
                                                        />
                                                        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                                            <p className="text-blue-300 text-sm">
                                                                💡 <strong>Tip:</strong> Make sure to replace <code className="bg-blue-800/30 px-1 rounded">&lt;your-instance-id&ht;</code> and <code className="bg-blue-800/30 px-1 rounded">&lt;your-api-key&ht;</code> with your actual values.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-neutral-400">
                                        No instances found. Please complete the onboarding process.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    };

    return (
        <>
            <SignedIn>
                <div className="dark h-screen w-full bg-neutral-900 flex">
                    <Sidebar open={open} setOpen={setOpen}>
                        <SidebarBody className="justify-between gap-10">
                            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                                {/* Logo/Title */}
                                <div className="mt-8 mb-6">
                                    <h1 className="text-xl font-[bold] text-white px-2">
                                        ArchiveNet
                                    </h1>
                                </div>

                                {/* Navigation Links */}
                                <div className="flex flex-col gap-2">
                                    {links.map((link, idx) => (
                                        <div
                                            key={idx}
                                            onClick={link.disabled ? undefined : link.onClick}
                                            className={`flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer ${link.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-700/50 rounded-lg px-2'
                                                } ${activeView === (link.label === 'Dashboard' ? 'dashboard' : 'subscription')
                                                    ? 'bg-neutral-700 rounded-lg px-2'
                                                    : ''
                                                }`}
                                        >
                                            {link.icon}
                                            <span className={`text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 ${open ? 'opacity-100' : 'opacity-0'}`}>
                                                {link.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Onboarding Status Indicator */}
                                {(!subscription?.isActive || instances.length === 0) && (
                                    <div className="mt-4 px-2">
                                        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                                            <p className="text-yellow-300 text-xs">
                                                ⚠️ Complete onboarding to access all features
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced User section at bottom */}
                            <div className="">
                                <div className="flex items-center gap-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 hover:p-3 transition-colors cursor-pointer">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-10 h-10",
                                                userButtonPopoverCard: "bg-neutral-800 border-neutral-700",
                                                userButtonPopoverActionButton: "text-white hover:bg-neutral-700",
                                                userButtonPopoverActionButtonText: "text-white",
                                                userButtonPopoverFooter: "hidden"
                                            }
                                        }}
                                    />
                                    <div className={`flex-1 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="text-sm font-[semiBold] text-white truncate">
                                            {getDisplayName()}
                                        </div>
                                        <div className="text-md text-white truncate">
                                            <span className={subscription?.isActive ? "text-green-500" : "text-yellow-500"}>
                                                {getSubscriptionDisplay()}
                                            </span> Plan
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SidebarBody>
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 p-6 bg-neutral-900 overflow-y-auto">
                        {renderMainContent()}
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}