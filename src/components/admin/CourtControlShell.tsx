import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURT_IDS } from "@/constants";
import shuttlecock from "../../../assets/shuttlecock.png";

interface CourtControlShellProps {
    currentSet: number;
    setsA: number;
    setsB: number;
    tracker?: React.ReactNode;
    actionBar: React.ReactNode;
    children?: React.ReactNode;
}

const navItems = [
    { href: "/admin", label: "Globál", icon: Settings, exact: true },
    { href: `/admin/${COURT_IDS.COURT_1}`, label: "Kurt 1", icon: LayoutDashboard, exact: false },
    { href: `/admin/${COURT_IDS.COURT_2}`, label: "Kurt 2", icon: LayoutDashboard, exact: false },
];

function NavButton({
    href,
    label,
    icon: Icon,
    active,
    external,
}: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
    external?: boolean;
}) {
    const className = cn(
        "flex min-w-[2.75rem] flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-[9px] font-medium leading-none transition-colors",
        active
            ? "bg-brand-blue/10 text-brand-blue"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

    const content = (
        <>
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{label}</span>
        </>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className} title={label}>
                {content}
            </a>
        );
    }

    return (
        <Link to={href} className={className} title={label}>
            {content}
        </Link>
    );
}

export function CourtControlShell({
    currentSet,
    setsA,
    setsB,
    tracker,
    actionBar,
    children,
}: CourtControlShellProps) {
    const location = useLocation();

    const isActive = (href: string, exact: boolean) =>
        exact ? location.pathname === href : location.pathname === href;

    return (
        <div className="court-control min-h-dvh bg-slate-50 lg:bg-slate-100">
            <div className="mx-auto flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-slate-50 md:max-w-md md:border-x md:border-border/60 md:shadow-lg lg:max-w-none lg:border-x-0 lg:shadow-none">
                <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-white px-2 py-1 sm:px-3 lg:px-6 xl:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-red p-1">
                            <img src={shuttlecock} alt="" className="h-full w-full object-contain brightness-0 invert" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <span className="rounded-md bg-muted px-2 py-1">Set {currentSet}</span>
                            <span className="tabular-nums text-muted-foreground">
                                {setsA}–{setsB}
                            </span>
                        </div>
                    </div>

                    <nav className="flex shrink-0 items-center gap-0.5">
                        {navItems.map(({ href, label, icon, exact }) => (
                            <NavButton
                                key={href}
                                href={href}
                                label={label}
                                icon={icon}
                                active={isActive(href, exact)}
                            />
                        ))}
                        <NavButton
                            href="/"
                            label="Náhled"
                            icon={ExternalLink}
                            external
                        />
                    </nav>
                </header>

            {tracker}

            {children ? (
                <div className="flex min-h-0 flex-1 flex-col justify-end px-2 pb-2 sm:px-3">
                    {children}
                </div>
            ) : (
                <div className="min-h-0 flex-1" />
            )}

            <div className="court-control-actions shrink-0 border-t border-border/60 bg-white px-2 lg:px-6 xl:px-8">
                {actionBar}
            </div>
            </div>
        </div>
    );
}
