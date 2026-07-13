interface LoadingScreenProps {
    message?: string;
}

export const LoadingScreen = ({ message = "Načítám data..." }: LoadingScreenProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-2xl">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span>{message}</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
