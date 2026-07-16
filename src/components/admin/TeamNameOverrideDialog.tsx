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

interface TeamNameOverrideDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    teamAName: string;
    teamBName: string;
    onTeamAChange: (value: string) => void;
    onTeamBChange: (value: string) => void;
    onSave: () => void;
    onClear?: () => void;
}

export function TeamNameOverrideDialog({
    open,
    onOpenChange,
    title,
    description,
    teamAName,
    teamBName,
    onTeamAChange,
    onTeamBChange,
    onSave,
    onClear,
}: TeamNameOverrideDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="admin-dialog max-h-[90dvh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white">{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="override-team-a" className="admin-label">Tým A</Label>
                        <Input
                            id="override-team-a"
                            className="admin-input min-h-[44px] text-base"
                            value={teamAName}
                            onChange={(e) => onTeamAChange(e.target.value)}
                            placeholder="Ponechte prázdné pro výchozí jméno"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="override-team-b" className="admin-label">Tým B</Label>
                        <Input
                            id="override-team-b"
                            className="admin-input min-h-[44px] text-base"
                            value={teamBName}
                            onChange={(e) => onTeamBChange(e.target.value)}
                            placeholder="Ponechte prázdné pro výchozí jméno"
                        />
                    </div>
                </div>

                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
                    {onClear && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onClear}
                            className="min-h-[44px] w-full sm:mr-auto sm:w-auto"
                        >
                            Vymazat přepis
                        </Button>
                    )}
                    <div className="flex w-full flex-col gap-2 xs:flex-row xs:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="admin-outline-btn min-h-[44px] w-full xs:w-auto"
                        >
                            Zrušit
                        </Button>
                        <Button
                            onClick={onSave}
                            className="min-h-[44px] w-full bg-brand-blue hover:bg-brand-blue/90 xs:w-auto"
                        >
                            Uložit
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
