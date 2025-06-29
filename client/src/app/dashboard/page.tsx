import { SidebarDemo } from '@/components/layout/Sidebar';
import { Subscriptions } from '@/components/layout/Subscriptions';

// #TODO: Make this mobile responsive

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black">
            <SidebarDemo />
            
            {/* Pricing Section */}
            <div className="ml-0 md:ml-[300px] p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-[bold] text-white mb-2">
                        Upgrade Your Plan
                    </h1>
                    <p className="text-neutral-400 font-[regular]">
                        Choose the plan that best fits your needs and unlock more features.
                    </p>
                </div>
                
                <Subscriptions />
            </div>
        </div>
    );
}