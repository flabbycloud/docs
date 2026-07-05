"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot, ChevronRight, FileClock, Grid2X2, HardDrive, Network,
  Server, Shield, Sparkles, Users,
} from "./icons";
import type { DocMeta } from "@/lib/docs";

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  products: Grid2X2,
  "why-flabbycloud": Sparkles,
  "ai-tools": Bot,
  "virtual-machines": Server,
  volumes: HardDrive,
  "object-storage": HardDrive,
  vpc: Network,
  firewall: Shield,
  teams: Users,
};

const groups = [
  { title: "Главная", slugs: ["products", "why-flabbycloud", "ai-tools"] },
  { title: "Build", slugs: ["virtual-machines"] },
  { title: "Store", slugs: ["volumes", "object-storage"] },
  { title: "Network", slugs: ["vpc", "firewall"] },
  { title: "Manage", slugs: ["teams"] },
];

const plainLinks = new Set(["products", "why-flabbycloud", "ai-tools", "teams"]);

export function Sidebar({ docs, open, close }: { docs: DocMeta[]; open: boolean; close: () => void }) {
  const pathname = usePathname();
  const bySlug = Object.fromEntries(docs.map((doc) => [doc.slug, doc]));
  const changelogActive = pathname === "/docs/changelog";

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <Link className={`changelog ${changelogActive ? "active" : ""}`} href="/docs/changelog" onClick={close}>
        <FileClock size={17} /> <span>Changelog</span>
      </Link>
      {groups.map((group) => (
        <section className="nav-group" key={group.title}>
          <h3>{group.title}</h3>
          {group.slugs.map((slug) => {
            const doc = bySlug[slug];
            if (!doc) return null;
            const Icon = icons[slug] || Grid2X2;
            const active = pathname === `/docs/${slug}`;
            return (
              <Link className={active ? "active" : ""} href={`/docs/${slug}`} key={slug} onClick={close}>
                <Icon size={17} />
                <span>{doc.title}</span>
                <ChevronRight className={`chevron ${plainLinks.has(slug) ? "chevron-hidden" : ""}`} size={14} />
              </Link>
            );
          })}
        </section>
      ))}
    </aside>
  );
}
