"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import Navbar from "@/components/ui/Navbar"
import { createNewApiKey, deployArweaveContract } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CodeBlock } from "@/components/ui/code-block"
import { IconCopy } from "@tabler/icons-react"

const setupInstructions = "pipx install xeni\neva --key <instance_key>\neva connect <agent_name>";

export default function SuccessPage() {
    const { getToken } = useAuth()
    const [isInstanceKeyCreated, setIsInstanceKeyCreated] = useState(false)
    const [contractId, setContractId] = useState<string | null>(null)
    const [instanceKey, setInstanceKey] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleContractDeployment = async () => {
            const token = await getToken();
            if (!token) {
                console.error("Token is not available, user might not be signed in")
                return;
            }
            await createNewApiKey(token);
            console.log("Created API Key:");
            const deployedContract = await deployArweaveContract(token);

            if (deployedContract) {
                console.log("Contract deployed successfully:", deployedContract);
                const key = deployedContract.data.contractHashFingerprint;
                const contractId = deployedContract.data.contractTxId;
                setInstanceKey(key);
                setContractId(contractId);
                setIsInstanceKeyCreated(true);
                console.log("Deployed Contract ID:", contractId);
                console.log("Instance Key Hash:", key);
            }
        }
        handleContractDeployment()
    }, [])

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen bg-black overflow-hidden mt-20">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <h1 className="text-3xl font-bold mb-4 text-white font-[semiBold]">Follow these steps to setup your instance</h1>

                    {isInstanceKeyCreated ? (
                        <div className="text-white flex flex-col gap-5 w-1/3">
                            <h1 className="text-xl font-bold font-[semiBold] mb-2">Your ArchiveNET instance key</h1>
                            <div className="w-full flex items-center gap-3 bg-zinc-900 p-3 rounded-lg border border-gray-700">
                                <code className="flex-1 text-white font-mono text-sm">
                                    {`${instanceKey?.slice(0, 7)}...`}
                                </code>
                                <button
                                    onClick={() => {
                                        if (instanceKey) {
                                            navigator.clipboard.writeText(instanceKey)
                                            setCopied(true)
                                            setTimeout(() => setCopied(false), 2000)
                                        }
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors p-1 flex items-center gap-1"
                                    title="Copy API key to clipboard"
                                >
                                    {copied ? (
                                        <span className="text-green-400 text-sm font-medium">Copied</span>
                                    ) : (
                                        <IconCopy size={14} />
                                    )}
                                </button>
                            </div>
                            <h1 className="text-xl font-bold font-[semiBold] mb-2 mt-4">Your Contract Transaction ID</h1>
                            <div className="w-full flex items-center gap-3 bg-zinc-900 p-3 rounded-lg border border-gray-700">
                                <code className="flex-1 text-white font-mono text-sm">
                                    {contractId}
                                </code>
                                <button
                                    onClick={() => {
                                        if (contractId) {
                                            navigator.clipboard.writeText(contractId)
                                            setCopied(true)
                                            setTimeout(() => setCopied(false), 2000)
                                        }
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors p-1 flex items-center gap-1"
                                    title="Copy Contract ID to clipboard"
                                >
                                    {copied ? (
                                        <span className="text-green-400 text-sm font-medium">Copied</span>
                                    ) : (
                                        <IconCopy size={14} />
                                    )}
                                </button>
                            </div>
                            <p className="text-red-400 mt-2 text-md">This key is used to authenticate your requests to the ArchiveNET API. Once lost this key cannot be recovered.</p>
                            <h1 className="text-white text-lg font-[semiBold]">Paste these setup instructions in your terminal to setup your instance</h1>
                            <div className="">
                                <CodeBlock code={setupInstructions} filename="setup_instructions" language="bash" />
                                <p className="text-white text-lg mt-2">Now restart your agent and you are good to go!</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-yellow-500 mt-4">Creating your api key...</p>
                    )}

                    <Button variant="outline" className="bg-white text-black my-7 cursor-pointer" onClick={() => router.push('/dashboard')}>Take Me to Dashboard</Button>
                </div>
            </div>
        </>
    )
}