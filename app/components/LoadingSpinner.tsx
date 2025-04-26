
interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="flex justify-center items-center py-8">
            <span className="flex items-center gap-2">
                <div className="rounded-full h-6 w-6 bg-gradient-to-r from-periwinkle-400 to-periwinkle-700 animate-spin"></div>
                <span>{message}</span>
            </span>
        </div>
    );
} 