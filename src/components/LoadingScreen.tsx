import { cn } from "@/lib/utils";

interface LoadingScreenProps {
    message?: string;
    variant?: "default" | "scoreboard";
}

export const LoadingScreen = ({
    message = "Načítám data...",
    variant = "default",
}: LoadingScreenProps) => {
    return (
        <div
            className={cn(
                "flex min-h-screen items-center justify-center text-2xl",
                variant === "scoreboard"
                    ? "bg-gradient-to-br from-brand-blue to-brand-red text-white"
                    : "bg-background text-foreground"
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <div
                    className={cn(
                        "h-8 w-8 animate-spin rounded-full border-4 border-t-transparent",
                        variant === "scoreboard" ? "border-white" : "border-primary"
                    )}
                />
                <span>{message}</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
