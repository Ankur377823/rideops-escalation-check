import Link from "next/link";
import { Icon } from "@/components/ui";
import type { IconName } from "@/components/ui";

type Screen = { href: string; icon: IconName; role: string; name: string; text: string };

const SCREENS: Screen[] = [
  {
    href: "/tickets",
    icon: "inbox",
    role: "L1 agent",
    name: "Ticket queue",
    text: "Find a ticket and open its escalation check.",
  },
  {
    href: "/dashboard",
    icon: "chart",
    role: "Support lead",
    name: "Dashboard",
    text: "The weekly measures, agent comparison and tickets that need attention.",
  },
  {
    href: "/log",
    icon: "list",
    role: "Support lead",
    name: "Decision log",
    text: "Every check and what the agent decided. This is how a pilot is measured.",
  },
  {
    href: "/known-issues",
    icon: "alert",
    role: "Engineering",
    name: "Known issues",
    text: "The board engineering maintains. Agents see it during the check.",
  },
  {
    href: "/evidence",
    icon: "flask",
    role: "Evidence",
    name: "Does it work?",
    text: "Two tests of the idea on the ticket history, with the assumptions stated.",
  },
];

export function ScreenGuide() {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-900">Screens, by who uses them</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((screen) => (
          <Link
            key={screen.href}
            href={screen.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors hover:border-blue-300"
          >
            <div className="flex items-center gap-2 text-blue-700">
              <Icon name={screen.icon} />
              <span className="text-xs font-semibold uppercase tracking-wide">{screen.role}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
              {screen.name}
            </div>
            <p className="mt-1 text-sm text-slate-600">{screen.text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
