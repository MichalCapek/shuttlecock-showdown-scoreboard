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
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <CardTitle className="text-base xs:text-lg">{label}</CardTitle>
                        <CardDescription>Živý přehled skóre</CardDescription>
                    </div>
                    <Link to={`/admin/${courtId}`} className="shrink-0">
                        <Button variant="ghost" size="sm" className="min-h-[44px] gap-1 text-brand-blue">
                            Ovládání
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!data ? (
                    <p className="text-sm text-muted-foreground">Načítám data…</p>
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

                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">Set {data.currentSet}</Badge>
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

                        <Separator />

                        <div className="flex flex-col gap-2 xs:flex-row xs:flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEditNames}
                                className="min-h-[44px] w-full gap-1.5 xs:w-auto"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Přepsat jména
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearOverrides}
                                className="min-h-[44px] w-full gap-1.5 text-destructive hover:text-destructive xs:w-auto"
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
    const borderColor = accent === "blue" ? "border-brand-blue/30" : "border-brand-red/30";
    const bgColor = accent === "blue" ? "bg-brand-blue/5" : "bg-brand-red/5";

    return (
        <div className={`rounded-lg border ${borderColor} ${bgColor} p-3`}>
            <p className="break-words text-sm font-medium leading-snug">
                {name}
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums xs:text-3xl">{points}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Sety: {sets}</span>
                {isServing && (
                    <Badge className="bg-amber-400 text-xs text-black hover:bg-amber-400">
                        Servis
                    </Badge>
                )}
            </div>
        </div>
    );
}
