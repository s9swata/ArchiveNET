"use client";
import Navbar from "../ui/Navbar"

export const Dashboard = ({ showNavbar = true }: { showNavbar?: boolean }) => {

    return (
        <div className="text-white text-xl flex-1 p-4 bg-black">
            {showNavbar && <Navbar />}
            <div className="p-6">
                Dashboard
            </div>
        </div>
    )
}