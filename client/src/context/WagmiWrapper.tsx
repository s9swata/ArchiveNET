"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

const config = createConfig({
    ssr: true,
    chains: [mainnet],
    connectors: [metaMask()],
    transports: {
        [mainnet.id]: http(process.env.NEXT_PUBLIC_INFURA_MAINNET),
    },
});

const queryClient = new QueryClient();

export default function WagmiWrapper({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
