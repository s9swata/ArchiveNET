"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from "@clerk/nextjs";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { getInstances } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Instance {
    id: string;
    name: string;
    createdAt?: string;
    lastUsedAt?: string;
}

export function SidebarDemo() {

    const { getToken } = useAuth();
    const [instances, setInstances] = useState<Instance[]>([]);

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

        handleGetInstances();
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
                                        <SidebarLink key={idx} link={link} />
                                    ))}
                                </div>
                            </div>

                            {/* User section at bottom */}
                            <div className="p-2">
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <IconUserBolt className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-[semiBold] text-white">User</div>
                                        <div className="text-xs text-neutral-400">Signed in</div>
                                    </div>
                                </div>
                            </div>
                        </SidebarBody>
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 p-6 bg-neutral-900 overflow-y-auto">
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
                                                <div className="text-right">
                                                    <p className="text-sm text-neutral-300">
                                                        Last used: {instance.lastUsedAt ? new Date(instance.lastUsedAt).toLocaleDateString() : 'Never'}
                                                    </p>
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
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}