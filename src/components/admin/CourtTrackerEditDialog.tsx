import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { CourtTrackerState, PlayerSlot } from "@/types";
import { SLOT_PLACEHOLDERS } from "@/lib/courtTrackerRules";

interface CourtTrackerEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tracker: CourtTrackerState;
    onSave: (players: Record<PlayerSlot, string>) => void;
}

const SLOT_LABELS: Record<PlayerSlot, string> = {
    leftTop: "Vlevo – nahoře",
    leftBottom: "Vlevo – dole",
    rightTop: "Vpravo – nahoře",
    rightBottom: "Vpravo – dole",
};

const SINGLES_LABELS = {
    leftTop: "Hráč vlevo",
    rightTop: "Hráč vpravo",
};

export function CourtTrackerEditDialog({
    open,
    onOpenChange,
    tracker,
    onSave,
}: CourtTrackerEditDialogProps) {
    const [players, setPlayers] = useState({
        leftTop: "",
        leftBottom: "",
        rightTop: "",
        rightBottom: "",
    });

    useEffect(() => {
        if (open) {
            setPlayers({
                leftTop: tracker.leftTop,
                leftBottom: tracker.leftBottom,
                rightTop: tracker.rightTop,
                rightBottom: tracker.rightBottom,
            });
        }
    }, [open, tracker]);

    const isSingles = tracker.gameMode === "singles";

    const visibleSlots: PlayerSlot[] = isSingles
        ? ["leftTop", "rightTop"]
        : ["leftTop", "leftBottom", "rightTop", "rightBottom"];

    const handleSave = () => {
        onSave(players);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Jména hráčů na kurtu</DialogTitle>
                    <DialogDescription>
                        Jména se ukládají pouze v tomto zařízení. V dvouhře stačí zadat levého a pravého hráče.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2">
                    {visibleSlots.map((slot) => (
                        <div key={slot} className="space-y-1">
                            <Label htmlFor={`player-${slot}`} className="text-xs">
                                {isSingles && (slot === "leftTop" || slot === "rightTop")
                                    ? SINGLES_LABELS[slot]
                                    : SLOT_LABELS[slot]}
                            </Label>
                            <Input
                                id={`player-${slot}`}
                                value={players[slot]}
                                onChange={(e) =>
                                    setPlayers((p) => ({ ...p, [slot]: e.target.value }))
                                }
                                placeholder={SLOT_PLACEHOLDERS[slot]}
                            />
                        </div>
                    ))}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Zrušit
                    </Button>
                    <Button onClick={handleSave} className="bg-brand-blue hover:bg-brand-blue/90">
                        Uložit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
