"use client";

import { Suspense } from "react";
import { Web3Payment } from "@/components/layout/payment";
import WagmiWrapper from "../../context/WagmiWrapper";

function PaymentContent() {
    return <WagmiWrapper><Web3Payment /></WagmiWrapper>;
}

export default function PaymentsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </div>
    );
}