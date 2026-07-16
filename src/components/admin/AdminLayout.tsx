import { Link, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNav";

interface AdminLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const navItems = ADMIN_NAV_ITEMS;

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
    const location = useLocation();

    const isActive = (href: string, exact: boolean) =>
        exact ? location.pathname === href : location.pathname === href;

    return (
        <div className="admin-shell min-h-dvh">
            <div className="admin-accent-rail" />

            <header className="admin-header sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 xs:gap-4 xs:px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-2 xs:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-red text-xs font-bold text-white shadow-lg">
                            SS
                        </div>
                        <span className="hidden truncate font-semibold tracking-tight text-white xs:inline sm:max-w-none">
                            Shuttlecock Showdown
                        </span>
                    </div>

                    <nav className="flex shrink-0 items-center gap-0.5 xs:gap-1">
                        {navItems.map(({ href, label, icon: Icon, exact }) => (
                            <Link
                                key={href}
                                to={href}
                                className={cn(
                                    "admin-nav-link flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium xs:min-w-0 xs:px-3",
                                    isActive(href, exact) && "admin-nav-link--active"
                                )}
                                title={label}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">{label}</span>
                            </Link>
                        ))}
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-nav-link ml-0.5 flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium xs:min-w-0 xs:px-3"
                            title="Scoreboard"
                        >
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <span className="hidden sm:inline">Scoreboard</span>
                        </a>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] xs:px-4 sm:px-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="admin-page-title text-xl xs:text-2xl sm:text-3xl">{title}</h1>
                    {description && <p className="admin-page-desc mt-1">{description}</p>}
                </div>
                {children}
            </main>
        </div>
    );
}
