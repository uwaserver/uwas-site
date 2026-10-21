import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/ui";
import { releases, REPO } from "@/lib/content";
export const metadata: Metadata = {
  title: "Changelog",
  description:
    "The latest UWAS releases, improvements and fixes. Follow the project as it evolves.",
  alternates: { canonical: "/changelog/" },
};
export default function Changelog() {
  return (
    <>
      <PageHeading
        eyebrow="ALWAYS MOVING FORWARD"
        title={"A better server.\nOne release at a time."}
        description="A curated look at recent published releases. For the full history, implementation details and upgrade notes, head to the repository."
      />
      <section className="container page-content">
        <div className="release-list">
          {releases.map((r) => (
            <article className="release-entry" key={r.version}>
              <div className="release-meta">
                <strong>{r.version}</strong>
                <time>{r.date}</time>
              </div>
              <div className="release-text">
                <span className="eyebrow">{r.type}</span>
                <h2>{r.title}</h2>
                <ul>
                  {r.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  className="text-link"
                  href={`${REPO}/releases/tag/${r.version}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read release notes
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
          <a
            className="button button-secondary"
            href={`${REPO}/blob/main/CHANGELOG.md`}
          >
            View the complete changelog
            <ArrowUpRight size={16} />
          </a>
          <aside className="callout">
            v0.11.30, v0.11.27 and v0.11.24 were tags without published binaries.
            Their changes shipped in v0.11.31, v0.11.28 and v0.11.25 respectively.
          </aside>
        </div>
      </section>
    </>
  );
}
