import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AdminLoginProps {
    title: string;
    description?: string;
    onLogin: (password: string) => Promise<boolean>;
    errorMessage?: string;
}

export function AdminLogin({ title, description, onLogin, errorMessage }: AdminLoginProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const success = await onLogin(password);
        if (!success) {
            setError(errorMessage ?? "Nesprávné heslo");
        }
        setLoading(false);
    };

    return (
        <div className="admin-shell flex min-h-dvh items-center justify-center bg-slate-50 px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] xs:px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
                        <Lock className="h-6 w-6 text-brand-blue" />
                    </div>
                    <CardTitle className="text-lg xs:text-xl">{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Heslo</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Zadejte heslo"
                                autoFocus
                                className="min-h-[44px] text-base"
                            />
                        </div>
                        {error && (
                            <p className="text-center text-sm text-destructive">{error}</p>
                        )}
                        <Button
                            type="submit"
                            className="min-h-[44px] w-full bg-brand-blue hover:bg-brand-blue/90"
                            disabled={loading}
                        >
                            {loading ? "Ověřuji…" : "Přihlásit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
