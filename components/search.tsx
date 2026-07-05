"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DocMeta } from "@/lib/docs";

export function Search({ docs }: { docs: DocMeta[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = docs.filter((doc) =>
    `${doc.title} ${doc.description}`.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  function choose(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/docs/${slug}`);
  }

  return (
    <>
      <button className="search-trigger" onClick={() => setOpen(true)}>
        <SearchIcon size={18} />
        <span>Поиск по документации...</span>
        <kbd>Ctrl K</kbd>
      </button>
      {open && (
        <div className="search-overlay" onMouseDown={() => setOpen(false)}>
          <div className="search-dialog" onMouseDown={(event) => event.stopPropagation()}>
            <div className="search-input-row">
              <SearchIcon size={20} />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Что вы ищете?" />
              <button onClick={() => setOpen(false)} aria-label="Закрыть"><X size={18} /></button>
            </div>
            <div className="search-results">
              {results.map((doc) => (
                <button key={doc.slug} onClick={() => choose(doc.slug)}>
                  <strong>{doc.title}</strong>
                  <span>{doc.description}</span>
                </button>
              ))}
              {!results.length && <p>Ничего не найдено</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
