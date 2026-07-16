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
        <div className="admin-shell flex min-h-dvh flex-col px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] xs:px-4">
            <div className="admin-accent-rail shrink-0" />
            <div className="flex flex-1 items-center justify-center">
                <Card className="admin-card w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-brand-blue/30">
                            <Lock className="h-6 w-6 text-sky-200" />
                        </div>
                        <CardTitle className="admin-card-title text-lg xs:text-xl">{title}</CardTitle>
                        {description && (
                            <CardDescription className="admin-card-desc">{description}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="admin-label">
                                    Heslo
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Zadejte heslo"
                                    autoFocus
                                    className="admin-input min-h-[44px] text-base"
                                />
                            </div>
                            {error && (
                                <p className="text-center text-sm text-red-300">{error}</p>
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
        </div>
    );
}
