import { cn } from "@/lib/utils";
import type { CourtScore } from "@/types";
import { getSetHistory } from "@/lib/scoreboard";

interface PastSetsMiniBarProps {
    teamAName: string;
    teamBName: string;
    score: Pick<CourtScore, "pastSets" | "teamA" | "teamB">;
}

export function PastSetsMiniBar({
    teamAName,
    teamBName,
    score,
}: PastSetsMiniBarProps) {
    const hasCurrentScore = score.teamA > 0 || score.teamB > 0;
    if (score.pastSets.length === 0 && !hasCurrentScore) return null;

    const setHistory = getSetHistory(score);
    const columns = setHistory.map((set, index) => ({
        ...set,
        isCurrent: index === setHistory.length - 1,
    }));

    return (
        <div className="mx-2 mb-1.5 mt-4 shrink-0 border-t border-border/50 pt-3 xs:mx-3 sm:mt-5 lg:mx-0 lg:mt-4">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Přehled setů
            </span>
            <table className="w-full border-collapse text-[10px]">
                <thead>
                    <tr>
                        <th className="w-[38%] pb-1 pr-1 text-left font-medium text-muted-foreground" />
                        {columns.map((_, index) => (
                            <th
                                key={index}
                                className={cn(
                                    "pb-1 text-center font-medium tabular-nums",
                                    index === columns.length - 1
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {index + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="break-words py-0.5 pr-1 font-semibold leading-tight text-brand-blue">
                            {teamAName}
                        </td>
                        {columns.map((set, index) => (
                            <td
                                key={index}
                                className={cn(
                                    "py-0.5 text-center font-semibold tabular-nums",
                                    set.isCurrent ? "rounded-sm bg-white shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {set.teamA}
                            </td>
                        ))}
                    </tr>
                    <tr>
                        <td className="break-words py-0.5 pr-1 font-semibold leading-tight text-brand-red">
                            {teamBName}
                        </td>
                        {columns.map((set, index) => (
                            <td
                                key={index}
                                className={cn(
                                    "py-0.5 text-center font-semibold tabular-nums",
                                    set.isCurrent ? "rounded-sm bg-white shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                {set.teamB}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
