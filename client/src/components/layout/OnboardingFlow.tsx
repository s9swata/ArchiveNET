"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { useRouter } from "next/navigation";
import { 
  IconCheck, 
  IconChevronRight, 
  IconCreditCard, 
  IconServer, 
  IconTerminal,
  IconRocket
} from "@tabler/icons-react";

interface OnboardingFlowProps {
  currentStep: number;
  hasSubscription: boolean;
  hasInstance: boolean;
  onStepComplete: (step: number) => void;
  onNavigateToSubscription?: () => void;
  refreshSubscriptionData?: () => Promise<void>;
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
  const [expandedStep, setExpandedStep] = useState<number | null>(currentStep);
  
  // Polling state
  const [isPollingSubscription, setIsPollingSubscription] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptsRef = useRef(0);
  const MAX_POLLING_ATTEMPTS = 40; // 40 attempts * 3 seconds = 2 minutes

  // Handle subscription polling
  const startPolling = useCallback(() => {
    console.log("Starting subscription polling...");
    setIsPollingSubscription(true);
    pollingAttemptsRef.current = 0;
  }, []);

  const stopPolling = useCallback(() => {
    console.log("Stopping subscription polling...");
    setIsPollingSubscription(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Polling effect
  useEffect(() => {
    if (isPollingSubscription && refreshSubscriptionData) {
      // Check if subscription is already active
      if (hasSubscription) {
        console.log("Subscription is active, stopping polling");
        stopPolling();
        return;
      }

      // Start polling
      pollingIntervalRef.current = setInterval(async () => {
        pollingAttemptsRef.current += 1;
        console.log(`Polling attempt ${pollingAttemptsRef.current}/${MAX_POLLING_ATTEMPTS}`);

        try {
          await refreshSubscriptionData();
        } catch (error) {
          console.error("Error during polling:", error);
        }

        // Stop polling if max attempts reached
        if (pollingAttemptsRef.current >= MAX_POLLING_ATTEMPTS) {
          console.warn("Max polling attempts reached, stopping polling");
          stopPolling();
        }
      }, 3000); // Poll every 3 seconds

    } else {
      // Clear polling interval if not polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isPollingSubscription, hasSubscription, refreshSubscriptionData, stopPolling]);

  // Stop polling when subscription becomes active
  useEffect(() => {
    if (hasSubscription && isPollingSubscription) {
      console.log("Subscription detected as active, stopping polling");
      stopPolling();
    }
  }, [hasSubscription, isPollingSubscription, stopPolling]);

  const steps = [
    {
      id: 1,
      title: "Subscribe to a Plan",
      description: "Choose a subscription plan that fits your needs",
      icon: <IconCreditCard className="w-5 h-5" />,
      completed: hasSubscription,
      action: () => {
        // Start polling when user clicks to choose plan
        startPolling();
        // Navigate to subscription management
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
      completed: hasInstance,
      action: () => onStepComplete(2),
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

      {/* Polling Status Indicator */}
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
                (Attempt {pollingAttemptsRef.current}/{MAX_POLLING_ATTEMPTS})
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
                          disabled={!canProceed}
                        >
                          {step.buttonText}
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
                          </div>
                        )}

                        {/* Special content for Step 2 - Instance Creation */}
                        {step.id === 2 && hasSubscription && !hasInstance && (
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