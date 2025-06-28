import { Subscriptions } from '@/components/layout/Subscriptions';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import Navbar from '@/components/ui/Navbar';
export default function GetStartedPage() {
    return (
        <>
            <SignedIn>
                <div className='w-full h-full'>
                    <Navbar />
                    <div className='my-40'>
                        <Subscriptions />
                    </div>
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}