import { Link } from "react-router-dom";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CourtScore } from "@/types";

interface CourtSummaryCardProps {
    courtId: string;
    label: string;
    data: CourtScore | null;
    teamAName: string;
    teamBName: string;
    onEditNames: () => void;
    onClearOverrides: () => void;
}

export function CourtSummaryCard({
    courtId,
    label,
    data,
    teamAName,
    teamBName,
    onEditNames,
    onClearOverrides,
}: CourtSummaryCardProps) {
    return (
        <Card className="admin-card">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <CardTitle className="admin-card-title text-base xs:text-lg">{label}</CardTitle>
                        <CardDescription className="admin-card-desc">Živý přehled skóre</CardDescription>
                    </div>
                    <Link to={`/admin/${courtId}`} className="shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="admin-ghost-btn min-h-[44px] gap-1 text-sky-300 hover:text-sky-200"
                        >
                            Ovládání
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!data ? (
                    <p className="admin-muted text-sm">Načítám data…</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                            <TeamStat
                                name={teamAName}
                                points={data.teamA}
                                sets={data.setsA}
                                isServing={data.server === "home"}
                                accent="blue"
                            />
                            <TeamStat
                                name={teamBName}
                                points={data.teamB}
                                sets={data.setsB}
                                isServing={data.server === "away"}
                                accent="red"
                            />
                        </div>

                        <div className="admin-muted flex flex-wrap items-center gap-2 text-sm">
                            <Badge className="admin-badge admin-badge-set">Set {data.currentSet}</Badge>
                            {data.pastSets && data.pastSets.length > 0 && (
                                <span className="min-w-0 break-words">
                                    Historie:{" "}
                                    {data.pastSets.map((s, i) => (
                                        <span key={i}>
                                            {i > 0 && ", "}
                                            {s.teamA}:{s.teamB}
                                        </span>
                                    ))}
                                </span>
                            )}
                        </div>

                        <Separator className="admin-separator" />

                        <div className="flex flex-col gap-2 xs:flex-row xs:flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditNames}
                                className="admin-outline-btn min-h-[44px] w-full gap-1.5 xs:w-auto"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Přepsat jména
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearOverrides}
                                className="min-h-[44px] w-full gap-1.5 text-red-300 hover:bg-red-500/10 hover:text-red-200 xs:w-auto"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Vymazat přepis
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function TeamStat({
    name,
    points,
    sets,
    isServing,
    accent,
}: {
    name: string;
    points: number;
    sets: number;
    isServing: boolean;
    accent: "blue" | "red";
}) {
    return (
        <div
            className={cn(
                "rounded-lg p-3",
                accent === "blue" ? "admin-stat-box--blue" : "admin-stat-box--red"
            )}
        >
            <p className="break-words text-sm font-medium leading-snug text-white">{name}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-white xs:text-3xl">{points}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="admin-muted text-xs">Sety: {sets}</span>
                {isServing && (
                    <Badge className="border-0 bg-amber-400 text-xs text-black hover:bg-amber-400">
                        Servis
                    </Badge>
                )}
            </div>
        </div>
    );
}
