import { LayoutDashboard, Settings } from "lucide-react";
import { COURT_IDS } from "@/constants";

export const ADMIN_NAV_ITEMS = [
    { href: "/admin", label: "Globální", icon: Settings, exact: true },
    { href: `/admin/${COURT_IDS.COURT_1}`, label: "Kurt 1", icon: LayoutDashboard, exact: false },
    { href: `/admin/${COURT_IDS.COURT_2}`, label: "Kurt 2", icon: LayoutDashboard, exact: false },
] as const;
