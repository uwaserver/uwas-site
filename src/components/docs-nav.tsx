"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docs } from "@/lib/content";
export function DocsNav() {
  const path = usePathname();
  const groups = [...new Set(docs.map((d) => d.category))];
  const links = (
    <>
      <Link href="/docs/" aria-current={path === "/docs/" ? "page" : undefined}>
        Documentation overview
      </Link>
      {groups.map((group) => (
        <div key={group}>
          <h3>{group}</h3>
          {docs
            .filter((d) => d.category === group)
            .map((d) => (
              <Link
                aria-current={path === `/docs/${d.slug}/` ? "page" : undefined}
                key={d.slug}
                href={`/docs/${d.slug}/`}
              >
                {d.title}
              </Link>
            ))}
        </div>
      ))}
    </>
  );
  return (
    <>
      <aside className="docs-sidebar" aria-label="Documentation navigation">
        <h2>Documentation</h2>
        {links}
      </aside>
      <details className="docs-mobile-nav">
        <summary>Browse documentation</summary>
        <div
          className="docs-mobile-links"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a"))
              (event.currentTarget.parentElement as HTMLDetailsElement).open =
                false;
          }}
        >
          {links}
        </div>
      </details>
    </>
  );
}
