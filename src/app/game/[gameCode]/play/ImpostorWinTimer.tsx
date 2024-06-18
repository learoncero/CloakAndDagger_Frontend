import { useEffect, useState } from "react";

type Props = {
    initialTimer: number;
}

export default function ImpostorWinTimer({ initialTimer }: Props) {
    const [timeLeft, setTimeLeft] = useState(initialTimer);
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1) return prev - 1;
                clearInterval(timer);
                return 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (timeLeft <= 10) {
            setIsBlinking(true);
        }
    }, [timeLeft]);

    return (
        <div className={`text-2xl font-semibold text-center text-red-600 bg-black border-2 border-red-600 rounded-2xl p-4 ${isBlinking ? 'animate-blink' : ''}`}>
            You have <span className="font-bold">{timeLeft}</span><span className="font-bold">s</span> left!
        </div>
    );
}
