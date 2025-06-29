import { SidebarDemo } from '@/components/layout/Sidebar';

// #TODO: Make this mobile responsive

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black">
            <SidebarDemo />
            
            {/* Main Dashboard Content */}
            <div className="ml-0 md:ml-[300px] p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-[bold] text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-neutral-400 font-[regular]">
                        Welcome to your ArchiveNET dashboard. Manage your instances and monitor your usage.
                    </p>
                </div>
                
                {/* Dashboard Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Usage Stats Card */}
                    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                        <h3 className="text-lg font-[semiBold] text-white mb-4">Usage Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400">API Calls</span>
                                <span className="text-white font-[semiBold]">0 / 1,000</span>
                            </div>
                            <div className="w-full bg-neutral-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                        <h3 className="text-lg font-[semiBold] text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                                <div className="text-white font-[semiBold]">Create Instance</div>
                                <div className="text-neutral-400 text-sm">Deploy a new memory instance</div>
                            </button>
                            <button className="w-full text-left p-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors">
                                <div className="text-white font-[semiBold]">View Documentation</div>
                                <div className="text-neutral-400 text-sm">Learn how to integrate ArchiveNET</div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                        <h3 className="text-lg font-[semiBold] text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="text-neutral-400 text-sm">
                                No recent activity
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upgrade Section - Optional */}
                <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-[semiBold] text-white mb-2">
                                Ready to upgrade?
                            </h3>
                            <p className="text-neutral-400">
                                Get more storage, higher limits, and priority support with our Pro plan.
                            </p>
                        </div>
                        <button 
                            onClick={() => window.location.href = '/get-started'}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-[semiBold] transition-colors"
                        >
                            View Plans
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}