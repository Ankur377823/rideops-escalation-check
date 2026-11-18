import Link from "next/link";
import { Icon } from "@/components/ui";
import { ModeToggle } from "./ModeToggle";
import { NavLinks } from "./NavLinks";

/** Dark sidebar on wide screens, a dark top strip with scrolling links on phones. */
export function Sidebar() {
  return (
    <aside className="flex flex-col bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
      <Link href="/" className="flex items-center gap-2.5 px-4 py-4 lg:px-6 lg:py-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Icon name="shield" size={18} />
        </span>
        <span>
          <span className="block text-sm font-semibold leading-tight text-white">
            Escalation Check
          </span>
          <span className="block text-xs leading-tight text-slate-400">RideOps Support</span>
        </span>
      </Link>
      <div className="lg:flex-1 lg:overflow-y-auto lg:pt-2">
        <NavLinks />
      </div>
      <ModeToggle />
    </aside>
  );
}
