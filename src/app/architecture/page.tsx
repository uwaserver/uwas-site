import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHeading, CTA } from "@/components/ui";
import { REPO } from "@/lib/content";
export const metadata: Metadata = {
  title: "Architecture",
  description:
    "Follow a request through UWAS: TLS, middleware, domains, rewrite rules, cache and handlers.",
  alternates: { canonical: "/architecture/" },
};
const steps = [
  ["01", "Connect", "TCP, TLS & QUIC"],
  ["02", "Protect", "Global middleware"],
  ["03", "Route", "Virtual host lookup"],
  ["04", "Process", "Guards & rewrites"],
  ["05", "Cache", "L1 memory + L2 disk"],
  ["06", "Serve", "Static, PHP or proxy"],
];
export default function Architecture() {
  return (
    <>
      <PageHeading
        eyebrow="UNDER THE HOOD"
        title={"One process.\nA considered architecture."}
        description="A Go server that brings the request path and the operational tools together. Follow a request, then explore the source."
      />
      <section className="container page-content">
        <div className="architecture-flow">
          <div className="flow-heading">
            <h2>A request’s journey.</h2>
            <span>SIMPLIFIED REQUEST LIFECYCLE</span>
          </div>
          <section
            className="flow-steps"
            tabIndex={0}
            aria-label="Request lifecycle"
          >
            {steps.map(([id, title, body], i) => (
              <div style={{ display: "contents" }} key={id}>
                <div className="flow-step">
                  <span>{id}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                {i < steps.length - 1 && <ArrowRight size={17} />}
              </div>
            ))}
          </section>
        </div>
        <div className="architecture-grid">
          {[
            [
              "The public request path",
              "HTTP, HTTPS and optional HTTP/3 listeners route requests by host. Global middleware handles recovery, request identifiers, security headers, compression and other shared concerns.",
            ],
            [
              "Domain-level decisions",
              "IP rules, access controls, WAF and bandwidth checks apply per domain. The rewrite engine and cache lookup run before dispatch to a static, PHP, reverse-proxy or redirect handler.",
            ],
            [
              "Memory meets disk",
              "L1 memory and L2 disk store cacheable responses. ESI, tag purge and stale handling support more sophisticated content delivery without installing a separate caching service.",
            ],
            [
              "A private control plane",
              "The dashboard, REST admin API and MCP server are management interfaces. The upstream defaults bind management listeners to loopback; public sites use separate listeners.",
            ],
            [
              "Managed workloads",
              "PHP-FPM, native runtimes, databases and containers remain separate processes where required. UWAS coordinates their routing and administration; they are not embedded language runtimes.",
            ],
            [
              "Configuration that can change",
              "A YAML entry point, optional domain includes and CLI validation keep intent visible. Reloads rebuild per-domain handling while the service continues to run.",
            ],
          ].map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <a className="text-link" href={`${REPO}/blob/main/ARCHITECTURE.md`}>
            Explore the upstream architecture
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      <CTA />
    </>
  );
}
