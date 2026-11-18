"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";

type NavLink = { href: string; label: string; icon: IconName };

/** Links are grouped by the person who uses each screen. */
const GROUPS: { label: string; links: NavLink[] }[] = [
  { label: "Start here", links: [{ href: "/", label: "Overview", icon: "home" }] },
  { label: "L1 agent", links: [{ href: "/tickets", label: "Ticket queue", icon: "inbox" }] },
  {
    label: "Support lead",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: "chart" },
      { href: "/log", label: "Decision log", icon: "list" },
    ],
  },
  {
    label: "Engineering",
    links: [{ href: "/known-issues", label: "Known issues", icon: "alert" }],
  },
  { label: "Evidence", links: [{ href: "/evidence", label: "Does it work?", icon: "flask" }] },
];

const isActive = (href: string, path: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

export function NavLinks() {
  const path = usePathname();
  return (
    <nav
      aria-label="Main"
      className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0"
    >
      {GROUPS.map((group) => (
        <div key={group.label} className="flex gap-1 lg:flex-col">
          <div className="hidden px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:block">
            {group.label}
          </div>
          {group.links.map(({ href, label, icon }) => {
            const active = isActive(href, path);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon name={icon} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
