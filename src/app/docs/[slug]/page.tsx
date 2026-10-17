import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { docs, REPO, VERSION } from "@/lib/content";
import { CodeBlock } from "@/components/ui";
export const dynamicParams = false;
export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  return {
    title: doc?.title || "Documentation",
    description: doc?.summary,
    alternates: { canonical: `/docs/${slug}/` },
  };
}
const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = docs.findIndex((d) => d.slug === slug);
  const doc = docs[index];
  if (!doc) notFound();
  return (
    <div className="doc-body">
      <article className="doc-prose">
        <span className="eyebrow">{doc.category}</span>
        <h1>{doc.title}</h1>
        <p className="docs-intro">{doc.summary}</p>
        <div className="doc-meta">
          <span>UWAS {VERSION}</span>
          <span>Reviewed October 17, 2026</span>
          <a
            href={`${REPO}/blob/main/${doc.source}`}
            target="_blank"
            rel="noreferrer"
          >
            Upstream reference
            <ArrowUpRight size={12} />
          </a>
        </div>
        {doc.sections.map((s) => (
          <section
            key={s.title}
            id={sectionId(s.title)}
            className="doc-section"
          >
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            {s.code && (
              <CodeBlock
                code={s.code}
                title={
                  s.code.includes("domains:") ||
                  s.code.includes("global:") ||
                  s.code.includes("deploy:")
                    ? "Configuration example"
                    : "Terminal"
                }
                language={
                  s.code.includes("domains:") ||
                  s.code.includes("global:") ||
                  s.code.includes("deploy:")
                    ? "yaml"
                    : "shell"
                }
              />
            )}
            {s.note && <aside className="callout">{s.note}</aside>}
          </section>
        ))}
        <div className="callout">
          Need every option? Read the{" "}
          <a className="text-link" href={`${REPO}/blob/main/uwas.example.yaml`}>
            complete configuration reference
            <ArrowUpRight size={12} />
          </a>{" "}
          and the upstream upgrade notes for your release.
        </div>
        <nav className="doc-pagination" aria-label="Adjacent documentation">
          {index > 0 && (
            <Link href={`/docs/${docs[index - 1].slug}/`}>
              <span>← PREVIOUS</span>
              {docs[index - 1].title}
            </Link>
          )}
          {index < docs.length - 1 && (
            <Link href={`/docs/${docs[index + 1].slug}/`}>
              <span>NEXT →</span>
              {docs[index + 1].title}
            </Link>
          )}
        </nav>
      </article>
      <aside className="doc-toc" aria-label="On this page">
        <span>ON THIS PAGE</span>
        {doc.sections.map((s) => (
          <a href={`#${sectionId(s.title)}`} key={s.title}>
            {s.title}
          </a>
        ))}
        <a href={`${REPO}/issues/new`} target="_blank" rel="noreferrer">
          Suggest an improvement ↗
        </a>
      </aside>
    </div>
  );
}
