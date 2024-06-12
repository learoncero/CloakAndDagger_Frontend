import { useEffect, useState } from "react";
import { Role } from "@/app/types";

type Props = {
    role: Role;
};

export default function RoleInformation({ role }: Props) {
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        setIsBlinking(true);
        const timer = setTimeout(() => {
            setIsBlinking(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [role]);

    const formattedRole = role.replace(/_/g, " ");

    const roleClassName =
        role === "IMPOSTOR" || role === "IMPOSTOR_GHOST"
            ? "text-red-600"
            : "text-white";

    return (
        <div className="roleInformation bg-black text-white border border-gray-600 shadow-md rounded-lg p-4 font-sans text-sm w-full max-w-md mb-8">
            <div className="flex items-center border-b border-gray-400 mb-2 pb-2">
                <p className="text-2xl font-semibold">Role:</p>
                <p className={`ml-2 text-2xl font-bold ${roleClassName} ${isBlinking ? 'animate-blink' : ''}`}>
                    {formattedRole}
                </p>
            </div>
        </div>
    );
}
