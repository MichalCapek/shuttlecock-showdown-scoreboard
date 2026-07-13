import { Button } from "@/components/ui/button";

interface TeamBoxProps {
    displayName: string;
    scoreValue: number;
    isServer: boolean;
    onIncrement: () => void;
    onDecrement: () => void;
}

export const TeamBox = ({
    displayName,
    scoreValue,
    isServer,
    onIncrement,
    onDecrement,
}: TeamBoxProps) => {
    return (
        <div className="flex flex-col items-center p-4 border border-border rounded-xl bg-card shadow-sm w-64">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
                {displayName}
            </h2>
            <p className="text-4xl font-bold mb-4">{scoreValue}</p>
            <div className="flex flex-col items-center gap-2">
                <Button
                    onClick={onIncrement}
                    size="lg"
                    className="px-6 py-4 text-2xl font-bold h-auto"
                >
                    +
                </Button>
                <Button
                    onClick={onDecrement}
                    variant="destructive"
                    size="sm"
                    className="px-4 py-1"
                >
                    -
                </Button>
            </div>
            <div className="flex gap-4 p-4 min-h-[3rem]">
                {isServer && (
                    <span className="text-sm px-3 py-1 bg-yellow-400 text-black rounded-full shadow-md font-semibold flex items-center gap-1">
                        🏸 Servis
                    </span>
                )}
            </div>
        </div>
    );
};

export default TeamBox;
