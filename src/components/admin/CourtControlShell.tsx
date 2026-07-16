import { Link, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNav";
import shuttlecock from "../../../assets/shuttlecock.png";

interface CourtControlShellProps {
    currentSet: number;
    setsA: number;
    setsB: number;
    tracker?: React.ReactNode;
    actionBar: React.ReactNode;
    children?: React.ReactNode;
}

const navItems = ADMIN_NAV_ITEMS;

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
        "admin-nav-link court-control-nav-btn flex flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[9px] font-medium leading-none xs:text-[10px]",
        active && "admin-nav-link--active"
    );

    const content = (
        <>
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="max-w-[3.25rem] truncate">{label}</span>
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
        <div className="court-control court-control-shell min-h-dvh pt-[env(safe-area-inset-top)]">
            <div className="court-control-inner mx-auto flex h-dvh max-h-dvh w-full flex-col overflow-hidden md:max-w-md lg:max-w-none">
                <div className="admin-accent-rail shrink-0" />

                <header className="admin-header flex shrink-0 items-center justify-between gap-1 px-2 py-1 xs:gap-2 sm:px-3 lg:px-6 xl:px-8">
                    <div className="flex min-w-0 items-center gap-1.5 xs:gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-red p-1 shadow-lg">
                            <img src={shuttlecock} alt="" className="h-full w-full object-contain brightness-0 invert" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold xs:gap-1.5">
                            <span className="admin-badge admin-badge-set rounded-md px-1.5 py-0.5 xs:px-2">
                                Set {currentSet}
                            </span>
                            <span className="tabular-nums text-white/60">
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
                        <NavButton href="/" label="Náhled" icon={ExternalLink} external />
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

                <div className="court-control-actions shrink-0 px-2 lg:px-6 xl:px-8">
                    {actionBar}
                </div>
            </div>
        </div>
    );
}
