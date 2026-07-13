import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURT_IDS } from "@/constants";

interface AdminLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const navItems = [
    { href: "/admin", label: "Globální", icon: Settings, exact: true },
    { href: `/admin/${COURT_IDS.COURT_1}`, label: "Kurt 1", icon: LayoutDashboard, exact: false },
    { href: `/admin/${COURT_IDS.COURT_2}`, label: "Kurt 2", icon: LayoutDashboard, exact: false },
];

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
    const location = useLocation();

    const isActive = (href: string, exact: boolean) =>
        exact ? location.pathname === href : location.pathname === href;

    return (
        <div className="admin-shell min-h-screen bg-slate-50 text-foreground">
            <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-red text-xs font-bold text-white">
                            SS
                        </div>
                        <span className="hidden font-semibold tracking-tight sm:inline">
                            Shuttlecock Showdown
                        </span>
                    </div>

                    <nav className="flex items-center gap-1">
                        {navItems.map(({ href, label, icon: Icon, exact }) => (
                            <Link
                                key={href}
                                to={href}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                    isActive(href, exact)
                                        ? "bg-brand-blue/10 text-brand-blue"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </Link>
                        ))}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">Scoreboard</span>
                        </a>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {children}
            </main>
        </div>
    );
}
