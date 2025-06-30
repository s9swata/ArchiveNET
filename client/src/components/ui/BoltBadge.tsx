import Image from "next/image";
import boltIcon from "../../../public/icons/bolt.svg";

interface BoltBadgeProps {
    className?: string;
}

export const BoltBadge = ({ className = "" }: BoltBadgeProps) => {
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-full ${className}`}>
            <span className="text-white/90 text-sm font-medium">
                Built with
            </span>
            <Image
                src={boltIcon}
                alt="Bolt.new"
                width={60}
                height={16}
                className="opacity-90"
            />
        </div>
    );
};
