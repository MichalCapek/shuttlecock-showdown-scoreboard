import { cn } from "@/lib/utils";
import type { PastSet } from "@/types";

interface PastSetsMiniBarProps {
    teamAName: string;
    teamBName: string;
    pastSets: PastSet[];
    currentTeamA: number;
    currentTeamB: number;
}

export function PastSetsMiniBar({
    teamAName,
    teamBName,
    pastSets,
    currentTeamA,
    currentTeamB,
}: PastSetsMiniBarProps) {
    const hasCurrentScore = currentTeamA > 0 || currentTeamB > 0;
    if (pastSets.length === 0 && !hasCurrentScore) return null;

    const columns = [
        ...pastSets.map((set) => ({ ...set, isCurrent: false })),
        { teamA: currentTeamA, teamB: currentTeamB, isCurrent: true },
    ];

    return (
        <div className="mx-2 mb-1.5 mt-5 shrink-0 border-t border-border/50 pt-3 sm:mx-3">
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
                        <td className="truncate py-0.5 pr-1 font-semibold text-brand-blue" title={teamAName}>
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
                        <td className="truncate py-0.5 pr-1 font-semibold text-brand-red" title={teamBName}>
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
