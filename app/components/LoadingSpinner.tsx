
interface LoadingSpinnerProps {
    message?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function LoadingSpinner({
    message = "Loading...",
    size = "md",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-10 w-10",
        lg: "h-16 w-16",
        xl: "h-20 w-20",
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6 py-8">
            <div className={`relative ${sizeClasses[size]}`}>
                {/* Outer glowing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-periwinkle-400 border-r-periwinkle-500 animate-[spin_1s_linear_infinite] shadow-[0_0_15px_rgba(132,132,255,0.4)]"></div>

                {/* Inner counter-spinning ring */}
                <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-400 border-l-periwinkle-300 animate-[spin_1.5s_linear_infinite_reverse] opacity-80"></div>

                {/* Core pulse */}
                <div className="absolute inset-[35%] rounded-full bg-periwinkle-200 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.6)]"></div>
            </div>

            {message && (
                <span className="text-periwinkle-200 font-medium tracking-wider text-lg animate-pulse uppercase">
                    {message}
                </span>
            )}
        </div>
    );
}
