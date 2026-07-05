"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { DocMeta, Heading } from "@/lib/docs";
import { Search } from "./search";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

export function DocsShell({ docs, headings, children }: { docs: DocMeta[]; headings: Heading[]; children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/docs/products">FlabbyCloud<span>.</span></Link>
          <Search docs={docs} />
          <nav className="header-actions">
            <a href="mailto:support@example.com">Поддержка</a>
            <button className="dashboard">Dashboard <span>›</span></button>
            <ThemeToggle />
          </nav>
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className="tabs"><div><span className="selected">Продукты</span><span>Справочник</span></div></div>
      </header>
      <div className="docs-grid">
        <Sidebar docs={docs} open={menuOpen} close={() => setMenuOpen(false)} />
        {menuOpen && <button className="sidebar-backdrop" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
        <main className="doc-main">{children}</main>
        <aside className="toc">
          <h4><Menu size={14} /> На этой странице</h4>
          {headings.map((heading, index) => (
            <a className={index === 0 ? "current" : ""} href={`#${heading.id}`} key={heading.id}>{heading.text}</a>
          ))}
        </aside>
      </div>
    </div>
  );
}
