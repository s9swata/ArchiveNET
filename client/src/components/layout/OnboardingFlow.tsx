"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { 
  IconCheck, 
  IconChevronRight, 
  IconCreditCard, 
  IconServer, 
  IconTerminal,
  IconRocket,
  IconCopy
} from "@tabler/icons-react";

interface OnboardingFlowProps {
  currentStep: number;
  hasSubscription: boolean;
  hasInstance: boolean;
  onStepComplete: (step: number) => void;
  onNavigateToSubscription?: () => void;
  refreshSubscriptionData?: () => Promise<void>;
}

interface DeploymentData {
  contractId: string;
  contractHashFingerprint: string;
  userId: string;
  deployedAt: string;
  keyId: string;
}

const setupInstructions = `# Install ArchiveNET MCP globally
npm install -g @s9swata/archivenet-mcp

# Configure your environment
archivenet-edit-env --interactive

# Setup for your preferred LLM
archivenet-setup-mcp claude    # For Claude Desktop
archivenet-setup-mcp cursor    # For Cursor IDE

# Start using ArchiveNET
# Your MCP server is now ready!`;

export const OnboardingFlow = ({ 
  currentStep, 
  hasSubscription, 
  hasInstance, 
  onStepComplete,
  onNavigateToSubscription,
  refreshSubscriptionData
}: OnboardingFlowProps) => {
  const router = useRouter();
  const { getToken } = useAuth();
  const [expandedStep, setExpandedStep] = useState<number | null>(currentStep);
  
  // Subscription polling state
  const [isPollingSubscription, setIsPollingSubscription] = useState(false);
  const subscriptionPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const subscriptionPollingAttemptsRef = useRef(0);
  const MAX_SUBSCRIPTION_POLLING_ATTEMPTS = 40; // 40 attempts * 3 seconds = 2 minutes

  // Instance deployment polling state
  const [isPollingDeployment, setIsPollingDeployment] = useState(false);
  const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null);
  const deploymentPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deploymentPollingAttemptsRef = useRef(0);
  const MAX_DEPLOYMENT_POLLING_ATTEMPTS = 60; // 60 attempts * 5 seconds = 5 minutes
  const [copied, setCopied] = useState(false);

  // Subscription polling functions
  const startSubscriptionPolling = useCallback(() => {
    console.log("Starting subscription polling...");
    setIsPollingSubscription(true);
    subscriptionPollingAttemptsRef.current = 0;
  }, []);

  const stopSubscriptionPolling = useCallback(() => {
    console.log("Stopping subscription polling...");
    setIsPollingSubscription(false);
    if (subscriptionPollingIntervalRef.current) {
      clearInterval(subscriptionPollingIntervalRef.current);
      subscriptionPollingIntervalRef.current = null;
    }
  }, []);

  // Instance deployment polling functions
  const startDeploymentPolling = useCallback(() => {
    console.log("Starting deployment polling...");
    setIsPollingDeployment(true);
    deploymentPollingAttemptsRef.current = 0;
  }, []);

  const stopDeploymentPolling = useCallback(() => {
    console.log("Stopping deployment polling...");
    setIsPollingDeployment(false);
    if (deploymentPollingIntervalRef.current) {
      clearInterval(deploymentPollingIntervalRef.current);
      deploymentPollingIntervalRef.current = null;
    }
  }, []);

  // Create instance and deploy contract
  const createInstanceAndDeploy = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      console.log("Creating instance...");
      
      // Step 1: Create instance
      const instanceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instances/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!instanceResponse.ok) {
        throw new Error(`Failed to create instance: ${instanceResponse.statusText}`);
      }

      const instanceResult = await instanceResponse.json();
      console.log("Instance created:", instanceResult);

      // Step 2: Deploy contract
      console.log("Deploying contract...");
      const deployResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!deployResponse.ok) {
        throw new Error(`Failed to deploy contract: ${deployResponse.statusText}`);
      }

      const deployResult = await deployResponse.json();
      console.log("Contract deployed:", deployResult);

      if (deployResult.success && deployResult.data) {
        setDeploymentData(deployResult.data);
        stopDeploymentPolling();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error in createInstanceAndDeploy:", error);
      return false;
    }
  }, [getToken, stopDeploymentPolling]);

  // Subscription polling effect
  useEffect(() => {
    if (isPollingSubscription && refreshSubscriptionData) {
      if (hasSubscription) {
        console.log("Subscription is active, stopping polling");
        stopSubscriptionPolling();
        return;
      }

      subscriptionPollingIntervalRef.current = setInterval(async () => {
        subscriptionPollingAttemptsRef.current += 1;
        console.log(`Subscription polling attempt ${subscriptionPollingAttemptsRef.current}/${MAX_SUBSCRIPTION_POLLING_ATTEMPTS}`);

        try {
          await refreshSubscriptionData();
        } catch (error) {
          console.error("Error during subscription polling:", error);
        }

        if (subscriptionPollingAttemptsRef.current >= MAX_SUBSCRIPTION_POLLING_ATTEMPTS) {
          console.warn("Max subscription polling attempts reached, stopping polling");
          stopSubscriptionPolling();
        }
      }, 3000); // Poll every 3 seconds

    } else {
      if (subscriptionPollingIntervalRef.current) {
        clearInterval(subscriptionPollingIntervalRef.current);
        subscriptionPollingIntervalRef.current = null;
      }
    }

    return () => {
      if (subscriptionPollingIntervalRef.current) {
        clearInterval(subscriptionPollingIntervalRef.current);
        subscriptionPollingIntervalRef.current = null;
      }
    };
  }, [isPollingSubscription, hasSubscription, refreshSubscriptionData, stopSubscriptionPolling]);

  // Deployment polling effect
  useEffect(() => {
    if (isPollingDeployment) {
      if (deploymentData) {
        console.log("Deployment completed, stopping polling");
        stopDeploymentPolling();
        return;
      }

      deploymentPollingIntervalRef.current = setInterval(async () => {
        deploymentPollingAttemptsRef.current += 1;
        console.log(`Deployment polling attempt ${deploymentPollingAttemptsRef.current}/${MAX_DEPLOYMENT_POLLING_ATTEMPTS}`);

        const success = await createInstanceAndDeploy();
        
        if (success || deploymentPollingAttemptsRef.current >= MAX_DEPLOYMENT_POLLING_ATTEMPTS) {
          if (!success) {
            console.warn("Max deployment polling attempts reached, stopping polling");
          }
          stopDeploymentPolling();
        }
      }, 5000); // Poll every 5 seconds for deployment

    } else {
      if (deploymentPollingIntervalRef.current) {
        clearInterval(deploymentPollingIntervalRef.current);
        deploymentPollingIntervalRef.current = null;
      }
    }

    return () => {
      if (deploymentPollingIntervalRef.current) {
        clearInterval(deploymentPollingIntervalRef.current);
        deploymentPollingIntervalRef.current = null;
      }
    };
  }, [isPollingDeployment, deploymentData, createInstanceAndDeploy, stopDeploymentPolling]);

  // Stop subscription polling when subscription becomes active
  useEffect(() => {
    if (hasSubscription && isPollingSubscription) {
      console.log("Subscription detected as active, stopping polling");
      stopSubscriptionPolling();
    }
  }, [hasSubscription, isPollingSubscription, stopSubscriptionPolling]);

  const steps = [
    {
      id: 1,
      title: "Subscribe to a Plan",
      description: "Choose a subscription plan that fits your needs",
      icon: <IconCreditCard className="w-5 h-5" />,
      completed: hasSubscription,
      action: () => {
        startSubscriptionPolling();
        if (onNavigateToSubscription) {
          onNavigateToSubscription();
        } else {
          router.push('/get-started');
        }
      },
      buttonText: "Choose Plan",
      details: "Select from Basic, Pro, or Enterprise plans to unlock ArchiveNET's powerful memory management features."
    },
    {
      id: 2,
      title: "Create an Instance",
      description: "Deploy your personal ArchiveNET contract",
      icon: <IconServer className="w-5 h-5" />,
      completed: hasInstance || !!deploymentData,
      action: () => {
        startDeploymentPolling();
        createInstanceAndDeploy();
      },
      buttonText: "Create Instance",
      details: "Deploy your own decentralized memory contract on the Arweave blockchain for secure data storage."
    },
    {
      id: 3,
      title: "Setup MCP Locally",
      description: "Install and configure ArchiveNET MCP on your machine",
      icon: <IconTerminal className="w-5 h-5" />,
      completed: false, // This step is always manual
      action: () => setExpandedStep(expandedStep === 3 ? null : 3),
      buttonText: "View Instructions",
      details: "Follow the setup instructions to integrate ArchiveNET with your preferred AI tools."
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <IconRocket className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-[bold] text-white">
            Complete Your Onboarding
          </h1>
        </div>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Get started with ArchiveNET in just 3 simple steps. Set up your decentralized memory system and unlock the power of AI-driven context management.
        </p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
            <span>Progress</span>
            <span>{completedSteps} of {steps.length} completed</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Subscription Polling Status Indicator */}
      {isPollingSubscription && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <p className="text-blue-300 font-semibold">Checking Payment Status...</p>
              <p className="text-blue-400 text-sm">
                We're monitoring your payment. This page will update automatically once your subscription is processed.
                (Attempt {subscriptionPollingAttemptsRef.current}/{MAX_SUBSCRIPTION_POLLING_ATTEMPTS})
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deployment Polling Status Indicator */}
      {isPollingDeployment && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
            <div>
              <p className="text-green-300 font-semibold">Creating Instance & Deploying Contract...</p>
              <p className="text-green-400 text-sm">
                Setting up your decentralized memory contract on Arweave blockchain. This may take a few minutes.
                (Attempt {deploymentPollingAttemptsRef.current}/{MAX_DEPLOYMENT_POLLING_ATTEMPTS})
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Deployment Success Display */}
      {deploymentData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-green-900/20 border border-green-500/30 rounded-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <IconCheck className="w-6 h-6 text-green-400" />
              <h3 className="text-green-300 font-semibold text-lg">Contract Deployed Successfully!</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-green-400 text-sm font-medium mb-2">Session Key (Contract Hash Fingerprint):</p>
                <div className="flex items-center gap-3 bg-green-900/30 p-3 rounded-lg border border-green-500/20">
                  <code className="flex-1 text-green-300 font-mono text-sm break-all">
                    {deploymentData.contractHashFingerprint}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(deploymentData.contractHashFingerprint);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-green-400 hover:text-green-300 transition-colors p-1 flex items-center gap-1"
                    title="Copy session key to clipboard"
                  >
                    {copied ? (
                      <span className="text-green-300 text-sm font-medium">Copied</span>
                    ) : (
                      <IconCopy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-green-400 text-sm font-medium mb-2">Contract ID:</p>
                <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/20">
                  <code className="text-green-300 font-mono text-sm break-all">
                    {deploymentData.contractId}
                  </code>
                </div>
              </div>

              <div>
                <p className="text-green-400 text-sm font-medium mb-2">Deployed At:</p>
                <div className="bg-green-900/30 p-3 rounded-lg border border-green-500/20">
                  <code className="text-green-300 font-mono text-sm">
                    {new Date(deploymentData.deployedAt).toLocaleString()}
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 text-sm">
                <strong>⚠️ Important:</strong> Save your Session Key securely. You'll need it to configure your MCP client in the next step.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <div className="max-w-4xl mx-auto space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = step.completed;
          const isExpanded = expandedStep === step.id;
          const canProceed = index === 0 || steps[index - 1].completed;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`
                transition-all duration-300 cursor-pointer
                ${isActive ? 'border-blue-500 bg-blue-500/5' : 'border-neutral-700 bg-neutral-800/50'}
                ${isCompleted ? 'border-green-500 bg-green-500/5' : ''}
                ${!canProceed ? 'opacity-50' : 'hover:border-neutral-600'}
              `}>
                <CardHeader 
                  className="pb-4"
                  onClick={() => canProceed && setExpandedStep(isExpanded ? null : step.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Step Number/Status */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isActive 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-neutral-700 text-neutral-400'
                        }
                      `}>
                        {isCompleted ? (
                          <IconCheck className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{step.id}</span>
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {step.icon}
                          <CardTitle className="text-white text-lg">
                            {step.title}
                          </CardTitle>
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-500 text-white">
                              Completed
                            </Badge>
                          )}
                          {isActive && !isCompleted && (
                            <Badge variant="secondary" className="bg-blue-500 text-white">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-neutral-400 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Expand/Action Button */}
                    <div className="flex items-center space-x-3">
                      {canProceed && !isCompleted && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            step.action();
                          }}
                          className="bg-blue-400 hover:bg-blue-500 text-white"
                          disabled={!canProceed || (step.id === 1 && isPollingSubscription) || (step.id === 2 && isPollingDeployment)}
                        >
                          {(step.id === 1 && isPollingSubscription) ? "Processing..." : 
                           (step.id === 2 && isPollingDeployment) ? "Deploying..." : 
                           step.buttonText}
                        </Button>
                      )}
                      
                      {canProceed && (
                        <IconChevronRight 
                          className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0 border-t border-neutral-700">
                      <div className="space-y-4">
                        <p className="text-neutral-300">
                          {step.details}
                        </p>

                        {/* Special content for Step 3 - Setup Instructions */}
                        {step.id === 3 && (
                          <div className="space-y-4">
                            <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-600">
                              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <IconTerminal className="w-4 h-4 text-blue-400" />
                                Installation Commands
                              </h4>
                              <CodeBlock 
                                code={setupInstructions}
                                language="bash"
                                filename="setup-archivenet.sh"
                              />
                            </div>
                            
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                              <p className="text-blue-300 text-sm">
                                💡 <strong>Tip:</strong> After installation, restart your AI tool (Claude Desktop or Cursor) to activate the ArchiveNET integration.
                              </p>
                            </div>

                            {deploymentData && (
                              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                                <p className="text-green-300 text-sm">
                                  ✅ <strong>Your Session Key:</strong> Use this in your MCP configuration:
                                </p>
                                <code className="block mt-2 p-2 bg-green-900/30 rounded text-green-300 font-mono text-xs break-all">
                                  {deploymentData.contractHashFingerprint}
                                </code>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Special content for Step 2 - Instance Creation */}
                        {step.id === 2 && hasSubscription && !hasInstance && !deploymentData && (
                          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-300 text-sm">
                              ✅ <strong>Ready to proceed:</strong> You have an active subscription. Click "Create Instance" to deploy your contract.
                            </p>
                          </div>
                        )}

                        {/* Special content for Step 1 - Subscription */}
                        {step.id === 1 && !hasSubscription && (
                          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <p className="text-yellow-300 text-sm">
                              📋 <strong>Choose your plan:</strong> Select from Basic ($5), Pro ($15), or Enterprise ($50) plans to get started.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedSteps === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="border-green-500 bg-green-500/10 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <IconCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Onboarding Complete! 🎉
                </h3>
                <p className="text-green-300">
                  You're all set! Your ArchiveNET system is ready to revolutionize how you manage AI memory and context.
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};