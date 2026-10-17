import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { docs } from "@/lib/content";
import { CodeBlock } from "@/components/ui";
import { INSTALL } from "@/lib/content";
export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Install, configure and operate UWAS. Practical guides for your unified web stack.",
  alternates: { canonical: "/docs/" },
};
export default function Docs() {
  return (
    <>
      <span className="eyebrow">LET’S BUILD SOMETHING</span>
      <h1>The UWAS handbook.</h1>
      <p className="docs-intro">
        Everything you need to go from a new server to a connected web stack.
        Start small, understand the pieces, and make it yours.
      </p>
      <CodeBlock code={INSTALL} title="Start with one command" />
      <div className="docs-cards">
        {docs.map((d) => (
          <Link className="docs-card" key={d.slug} href={`/docs/${d.slug}/`}>
            <span>{d.category}</span>
            <h2>{d.title}</h2>
            <p>{d.summary}</p>
            <ArrowUpRight size={16} />
          </Link>
        ))}
      </div>
    </>
  );
}
