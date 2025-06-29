"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, UserButton, useUser } from "@clerk/nextjs";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    IconCrown,
    IconStar,
    IconDiamond,
} from "@tabler/icons-react";
import { getInstances, getUserSubscription } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowingEffect } from "../ui/glowing-effect";

interface Instance {
    id: string;
    name: string;
    createdAt?: string;
    lastUsedAt?: string;
}

interface UserSubscription {
    plan: string;
    isActive: boolean;
    quotaUsed?: number;
    quotaLimit?: number;
    renewsAt?: string;
}

export function SidebarDemo() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [instances, setInstances] = useState<Instance[]>([]);
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);

    useEffect(() => {
        const handleGetInstances = async () => {
            const token = await getToken();
            if (!token) {
                console.error("Token is not available, user might not be signed in");
                return;
            }
            const instancesData = await getInstances(token);
            console.log("Instances:", instancesData);
            setInstances(instancesData);
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
                setSubscription({ 
                    plan: subscriptionData.data.plan, 
                    isActive: subscriptionData.data.isActive,
                    quotaUsed: subscriptionData.data.quotaUsed,
                    quotaLimit: subscriptionData.data.quotaLimit,
                    renewsAt: subscriptionData.data.renewsAt
                });
            } catch (error) {
                console.error("Failed to fetch subscription:", error);
                setSubscription({ plan: "Free", isActive: false });
            }
        };

        handleGetInstances();
        fetchUserSubscription();
    }, [getToken])

    const links = [
        {
            label: "Dashboard",
            href: "#",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "#",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
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
        return subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) + " Plan";
    };

    const isFreePlan = () => {
        return !subscription || !subscription.isActive || subscription.plan === "Free";
    };

    const getUsagePercentage = () => {
        if (!subscription || !subscription.quotaLimit || !subscription.quotaUsed) return 0;
        return (subscription.quotaUsed / subscription.quotaLimit) * 100;
    };

    const getPlanIcon = () => {
        if (!subscription || !subscription.isActive) return <IconCrown className="w-4 h-4 text-gray-400" />;
        
        switch (subscription.plan.toLowerCase()) {
            case 'basic':
                return <IconCrown className="w-4 h-4 text-blue-400" />;
            case 'pro':
                return <IconStar className="w-4 h-4 text-purple-400" />;
            case 'enterprise':
                return <IconDiamond className="w-4 h-4 text-yellow-400" />;
            default:
                return <IconCrown className="w-4 h-4 text-gray-400" />;
        }
    };

    const getPlanColor = () => {
        if (!subscription || !subscription.isActive) return 'from-gray-500/20 to-gray-600/20';
        
        switch (subscription.plan.toLowerCase()) {
            case 'basic':
                return 'from-blue-500/20 to-blue-600/20';
            case 'pro':
                return 'from-purple-500/20 to-purple-600/20';
            case 'enterprise':
                return 'from-yellow-500/20 to-yellow-600/20';
            default:
                return 'from-gray-500/20 to-gray-600/20';
        }
    };

    const formatRenewalDate = () => {
        if (!subscription?.renewsAt) return null;
        return new Date(subscription.renewsAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const SubscriptionCard = () => (
        <div className="relative min-h-[120px] mb-4">
            <div className="relative h-full rounded-xl border border-gray-600/30 p-2">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                />
                
                {/* Liquid Glass Background */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${getPlanColor()}`} />
                    <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {getPlanIcon()}
                            <span className="text-white font-[semiBold] text-sm">
                                {getSubscriptionDisplay()}
                            </span>
                        </div>
                        {subscription?.isActive && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        )}
                    </div>

                    {subscription?.isActive ? (
                        <div className="space-y-2">
                            {/* Usage Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-300">Usage</span>
                                    <span className="text-white">
                                        {subscription.quotaUsed || 0} / {subscription.quotaLimit || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-1.5 rounded-full transition-all duration-300" 
                                        style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Renewal Date */}
                            {formatRenewalDate() && (
                                <div className="text-xs text-neutral-400">
                                    Renews {formatRenewalDate()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-xs text-neutral-400">
                                Limited to 100 API calls
                            </div>
                            <button 
                                onClick={() => window.location.href = '/get-started'}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs py-2 px-3 rounded-lg font-[semiBold] transition-all duration-200 transform hover:scale-105"
                            >
                                Upgrade Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderDashboardContent = () => {
        if (isFreePlan()) {
            return (
                <div className="space-y-6">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-[bold] text-white mb-2">
                            Welcome to ArchiveNET
                        </h1>
                        <p className="text-neutral-400 font-[regular]">
                            You're currently on the Free Plan. Upgrade to unlock more features and higher limits.
                        </p>
                    </div>

                    {/* Free Plan Limitations */}
                    <Card className="bg-neutral-800 border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                Free Plan Limitations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-400">API Calls</span>
                                    <span className="text-white font-[semiBold]">0 / 100</span>
                                </div>
                                <div className="w-full bg-neutral-700 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                                <div className="text-neutral-400 text-xs">
                                    Limited to 100 API calls per month
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upgrade Prompt */}
                    <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
                        <CardContent className="p-6">
                            <div className="text-center space-y-4">
                                <h3 className="text-lg font-[semiBold] text-white">
                                    Ready to unlock the full potential?
                                </h3>
                                <p className="text-neutral-400 text-sm">
                                    Upgrade to Pro or Enterprise for unlimited API calls, advanced features, and priority support.
                                </p>
                                <button 
                                    onClick={() => window.location.href = '/get-started'}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-[semiBold] transition-colors"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Getting Started */}
                    <Card className="bg-neutral-800 border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-white">Getting Started</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors cursor-pointer">
                                    <div className="text-white font-[semiBold] text-sm">📚 Read Documentation</div>
                                    <div className="text-neutral-400 text-xs">Learn how to integrate ArchiveNET</div>
                                </div>
                                <div className="p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors cursor-pointer">
                                    <div className="text-white font-[semiBold] text-sm">🚀 Deploy Instance</div>
                                    <div className="text-neutral-400 text-xs">Create your first memory instance</div>
                                </div>
                                <div className="p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors cursor-pointer">
                                    <div className="text-white font-[semiBold] text-sm">💬 Join Community</div>
                                    <div className="text-neutral-400 text-xs">Connect with other developers</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        } else {
            // Paid plan dashboard
            return (
                <div className="space-y-6">
                    {/* Usage Stats */}
                    <Card className="bg-neutral-800 border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-white">Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-400">API Calls</span>
                                    <span className="text-white font-[semiBold]">
                                        {subscription?.quotaUsed || 0} / {subscription?.quotaLimit || 0}
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${getUsagePercentage()}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Instances List */}
                    <Card className="bg-neutral-800 border-neutral-700">
                        <CardHeader>
                            <CardTitle className="text-white">Your Instances</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {instances && instances.length > 0 ? (
                                    instances.map((instance) => (
                                        <div key={instance.id} className="flex items-center justify-between p-4 rounded-lg bg-neutral-700/50 hover:bg-neutral-700 transition-colors">
                                            <div>
                                                <h3 className="text-white font-[semiBold]">{instance.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-xs text-green-400">Online</span>
                                                    <span className="text-xs text-neutral-500">•</span>
                                                    <span className="text-xs text-neutral-400">
                                                        Created {instance.createdAt ? new Date(instance.createdAt).toLocaleDateString() : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-neutral-400">
                                            {instances === undefined ? 'Loading instances...' : 'No instances found'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }
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

                                {/* Subscription Card */}
                                <div className="px-2 mb-6">
                                    <SubscriptionCard />
                                </div>

                                {/* Navigation Links */}
                                <div className="flex flex-col gap-2">
                                    {links.map((link, idx) => (
                                        <SidebarLink key={idx} link={link} />
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced User section at bottom */}
                            <div className="">
                                <div className="flex items-center gap-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 hover:p-3 transition-colors cursor-pointer">
                                    <div className="flex-shrink-0">
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
                                    </div>
                                    {open && (
                                        <div className="flex-1 min-w-0 transition-opacity duration-200">
                                            <div className="text-sm font-[semiBold] text-white truncate">
                                                {getDisplayName()}
                                            </div>
                                            <div className="text-xs text-neutral-400 truncate">
                                                {getSubscriptionDisplay()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SidebarBody>
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 p-6 bg-neutral-900 overflow-y-auto">
                        {renderDashboardContent()}
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}