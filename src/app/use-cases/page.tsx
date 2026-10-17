import type { Metadata } from "next";
import { ArrowRight, Box, Code2, Globe2, Network } from "lucide-react";
import Link from "next/link";
import { CTA, PageHeading } from "@/components/ui";
export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Static sites, WordPress, applications and reverse proxies. Find your UWAS workflow.",
  alternates: { canonical: "/use-cases/" },
};
const cases = [
  {
    Icon: Globe2,
    title: "A better home for static sites.",
    body: "Serve your portfolio, documentation or frontend build from your own infrastructure. UWAS handles HTTP, TLS and compression while you focus on what you publish.",
    points: [
      "Automatic HTTPS and renewals",
      "ETag, Range and pre-compressed file support",
      "SPA handling and per-domain configuration",
    ],
    link: "configuration",
    label: "Configure a static site",
  },
  {
    Icon: Code2,
    title: "WordPress, with room to grow.",
    body: "Bring familiar PHP applications and rewrite rules. Use the included dashboard for WordPress management, or keep your workflow in YAML and the CLI.",
    points: [
      "PHP-FPM connection pooling",
      ".htaccess rewrite imports",
      "WordPress installation and management workflows",
    ],
    link: "wordpress",
    label: "Explore WordPress hosting",
  },
  {
    Icon: Box,
    title: "Your app. Your deployment.",
    body: "Run native Node.js, Python, Ruby and Go applications or container workloads. Keep app supervision, Git deployment and public domain routing in one platform.",
    points: [
      "Native, custom and Docker runtimes",
      "Build detection and health checks",
      "Private repositories and deploy webhooks",
    ],
    link: "applications",
    label: "Deploy an application",
  },
  {
    Icon: Network,
    title: "One front door for your services.",
    body: "Put UWAS in front of a backend pool, route traffic and forward WebSocket connections. Configure the balancing behavior that fits your application.",
    points: [
      "Six load-balancing algorithms",
      "Health checks and circuit breakers",
      "Sticky sessions and weighted backends",
    ],
    link: "reverse-proxy",
    label: "Set up a reverse proxy",
  },
];
export default function UseCases() {
  return (
    <>
      <PageHeading
        eyebrow="BUILT AROUND WHAT YOU BUILD"
        title={"Different workloads.\nOne familiar place."}
        description="A small site, a growing application or a server full of domains. Choose your starting point and keep your infrastructure connected."
      />
      <section className="container page-content editorial-grid">
        {cases.map(({ Icon, ...c }) => (
          <article className="editorial-card" key={c.title}>
            <Icon size={30} strokeWidth={1.5} />
            <h2>{c.title}</h2>
            <p>{c.body}</p>
            <ul>
              {c.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link className="text-link" href={`/docs/${c.link}/`}>
              {c.label}
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>
      <CTA />
    </>
  );
}
