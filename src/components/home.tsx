"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Database,
  Globe2,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { LogoMark } from "./brand";
import { ButtonLink, CodeBlock, CopyButton, FAQ, Reveal } from "./ui";
import {
  configurations,
  faqs,
  features,
  INSTALL,
  REPO,
  VERSION,
} from "@/lib/content";

const icons = {
  lock: LockKeyhole,
  zap: Zap,
  network: Network,
  code: Code2,
  box: Box,
  layout: LayoutDashboard,
  shield: ShieldCheck,
  users: Users,
  sparkles: Sparkles,
  activity: Activity,
  database: Database,
  terminal: Terminal,
};
export function FeatureIcon({
  name,
  size = 22,
}: {
  name: string;
  size?: number;
}) {
  const Icon = icons[name as keyof typeof icons] || Box;
  return <Icon size={size} strokeWidth={1.65} />;
}

export function ServerDiagram() {
  return (
    <div
      className="server-diagram"
      aria-label="TLS, HTTP, cache, PHP and proxy requests converge in one UWAS server"
    >
      <div className="diagram-top">
        <span>
          <span className="status-dot" /> THE UNIFIED STACK
        </span>
        <span>01 — 05</span>
      </div>
      <div className="diagram-canvas">
        <svg
          className="diagram-lines"
          viewBox="0 0 600 430"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" opacity=".12" />
            </pattern>
            <linearGradient
              id="wire"
              x1="100"
              y1="200"
              x2="430"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#2563eb" stopOpacity=".2" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <rect width="600" height="430" fill="url(#dots)" />
          <g stroke="url(#wire)" strokeWidth="1.5">
            <path d="M120 65h60c70 0 35 150 130 150h40" />
            <path d="M120 140h80c50 0 45 75 110 75h40" />
            <path d="M120 215h230" />
            <path d="M120 290h80c50 0 45-75 110-75h40" />
            <path d="M120 365h60c70 0 35-150 130-150h40" />
            <path d="M450 215h95" />
          </g>
          <g
            stroke="#4b83ff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="3 55"
            className="flow-lines"
          >
            <path d="M120 65h60c70 0 35 150 130 150h40" />
            <path d="M120 140h80c50 0 45 75 110 75h40" />
            <path d="M120 215h230" />
            <path d="M120 290h80c50 0 45-75 110-75h40" />
            <path d="M120 365h60c70 0 35-150 130-150h40" />
            <path d="M450 215h95" />
          </g>
          <circle cx="548" cy="215" r="6" fill="#2563eb" />
          <circle cx="548" cy="215" r="14" stroke="#2563eb" opacity=".2" />
          <path
            d="M320 94v-25h160v25M320 336v25h160v-25"
            stroke="currentColor"
            opacity=".12"
          />
        </svg>
        <div className="diagram-inputs">
          {[
            [LockKeyhole, "TLS / ACME"],
            [Globe2, "HTTP/2 + 3"],
            [Layers3, "Cache engine"],
            [Code2, "PHP / FastCGI"],
            [Network, "Reverse proxy"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof LockKeyhole;
            return (
              <div className="diagram-input" key={String(label)}>
                <I size={17} />
                <span>{String(label)}</span>
                <span className="input-port" />
              </div>
            );
          })}
        </div>
        <div className="server-core">
          <div className="core-layer core-layer-back" />
          <div className="core-layer core-layer-mid" />
          <div className="core-front">
            <LogoMark />
            <span>UWAS</span>
            <span className="core-pins">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>
          <span className="core-caption">ONE BINARY. ALL CONNECTED.</span>
        </div>
        <div className="diagram-out">
          <span>:</span>443
        </div>
        <span className="diagram-label label-top">BUILT TO WORK TOGETHER</span>
        <span className="diagram-label label-bottom">
          CONFIGURE ONCE. SERVE EVERYTHING.
        </span>
      </div>
      <div className="diagram-bottom">
        <span>
          <span className="status-dot" /> All systems. One process.
        </span>
        <span className="mono">
          uwas serve <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero-stage">
      <div className="hero container">
        <div className="hero-copy" data-background-quiet>
          <Reveal>
            <Link href="/changelog/" className="release-badge">
              <span className="status-dot" />
              <span>{VERSION} is here</span>
              <span className="badge-divider" />
              Meet your new stack
              <ChevronRight size={14} />
            </Link>
            <h1>
              One binary. <br />
              Your entire <br />
              <span>web stack.</span>
            </h1>
            <p className="hero-description">
              The web server, reverse proxy, cache and hosting panel. Together
              at last. Built in Go. Built for you.
            </p>
            <div className="button-row">
              <ButtonLink href="/docs/getting-started/">
                Start building
              </ButtonLink>
              <ButtonLink href={REPO} secondary external>
                View on GitHub
              </ButtonLink>
            </div>
            <div className="hero-command">
              <span className="command-dollar">$</span>
              <code tabIndex={0} aria-label="Installation command">
                {INSTALL}
              </code>
              <CopyButton text={INSTALL} />
            </div>
            <div className="hero-trust">
              <span>
                <Check size={14} />
                Open source
              </span>
              <span>
                <Check size={14} />
                Self-hosted
              </span>
              <span>
                <Check size={14} />
                Your infrastructure
              </span>
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.1}>
          <div data-background-no-pulse>
            <ServerDiagram />
            <div className="diagram-note">
              <span className="note-line" />
              <span>
                Less infrastructure to think about.
                <br />
                <strong>More room to build something great.</strong>
              </span>
              <ArrowDown size={17} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TechnologyStrip() {
  return (
    <div className="tech-strip">
      <div className="container tech-inner">
        <span className="tech-label">
          ONE HOME FOR
          <br />
          <strong>YOUR WEB.</strong>
        </span>
        <div className="technology">
          <Code2 />
          <span>PHP</span>
        </div>
        <div className="technology">
          <Globe2 />
          <span>WordPress</span>
        </div>
        <div className="technology">
          <Box />
          <span>Docker</span>
        </div>
        <div className="technology">
          <Terminal />
          <span>Node.js</span>
        </div>
        <div className="technology">
          <Activity />
          <span>Prometheus</span>
        </div>
        <div className="technology">
          <Sparkles />
          <span>MCP</span>
        </div>
      </div>
    </div>
  );
}

export function StackComparison() {
  const [unified, setUnified] = useState(true);
  return (
    <section className="container section stack-section">
      <Reveal>
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / A SIMPLER FOUNDATION</span>
            <h2>
              Everything you need.
              <br />
              <span className="muted">Nothing in the way.</span>
            </h2>
          </div>
          <p>
            Stop connecting the pieces.
            <br />
            Start with a stack that’s already connected.
          </p>
        </div>
        <div className="stack-comparison">
          <div className="stack-story">
            <span className="small-label">THE INFRASTRUCTURE EQUATION</span>
            <h3>
              Five moving parts.
              <br />
              One clear answer.
            </h3>
            <p>
              Bring serving, routing, caching, certificates and administration
              into one coherent platform.
            </p>
            <div className="segmented" aria-label="Compare server stack">
              <button aria-pressed={!unified} onClick={() => setUnified(false)}>
                The usual stack
              </button>
              <button aria-pressed={unified} onClick={() => setUnified(true)}>
                The UWAS way <Sparkles size={13} />
              </button>
            </div>
            <span className="stack-footnote">
              PHP-FPM and application runtimes run alongside UWAS when needed.
            </span>
          </div>
          <div className={`stack-equation ${unified ? "is-unified" : ""}`}>
            <div className="stack-parts">
              {[
                ["Nginx", "Web server"],
                ["Varnish", "Cache"],
                ["Certbot", "Certificates"],
                ["Apache", "Rewrite rules"],
                ["cPanel", "Administration"],
              ].map(([name, label]) => (
                <div key={name}>
                  <span className="stack-part-symbol">{name.slice(0, 1)}</span>
                  <strong>{name}</strong>
                  <small>{label}</small>
                </div>
              ))}
            </div>
            <div className="stack-converge">
              <span />
              <ArrowDown size={22} />
              <span />
            </div>
            <div className="stack-result">
              <LogoMark />
              <div>
                <strong>
                  {unified
                    ? "One binary. One place."
                    : "Separate services. Separate configs."}
                </strong>
                <span>
                  {unified
                    ? "TLS + HTTP + cache + routing + control panel"
                    : "Install, connect, configure and maintain each part."}
                </span>
              </div>
              {unified && <Check className="stack-check" size={22} />}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function FeatureGrid({ all = false }: { all?: boolean }) {
  const Heading = all ? "h2" : "h3";
  const [category, setCategory] = useState("All");
  const shown = (all ? features : features.slice(0, 6)).filter(
    (f) => category === "All" || f.group === category,
  );
  return (
    <>
      {all && (
        <div className="feature-filters" aria-label="Feature categories">
          {["All", "Web server", "Platform", "Security", "Operations"].map(
            (c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ),
          )}
        </div>
      )}
      <div className={`feature-grid${all ? " feature-grid-catalog" : ""}`}>
        {shown.map((feature, index) => (
          <Reveal key={feature.id} delay={(index % 3) * 0.04}>
            <Link className="feature-card" href={`/docs/${feature.doc}/`}>
              <span className="feature-icon">
                <FeatureIcon name={feature.icon} />
              </span>
              <span className="feature-number">
                {String(features.indexOf(feature) + 1).padStart(2, "0")}
              </span>
              <Heading>{feature.title}</Heading>
              <p>{feature.description}</p>
              <div className="feature-tags">
                {feature.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <ArrowUpRight className="card-arrow" size={18} />
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}

export function ConfigurationPlayground() {
  const [tab, setTab] = useState<keyof typeof configurations>("Static site");
  return (
    <div className="config-playground">
      <div
        className="config-tabs"
        role="tablist"
        aria-label="Configuration examples"
      >
        {Object.keys(configurations).map((name) => (
          <button
            id={`tab-${name.replaceAll(" ", "-")}`}
            key={name}
            role="tab"
            aria-selected={tab === name}
            aria-controls="config-panel"
            tabIndex={tab === name ? 0 : -1}
            onKeyDown={(event) => {
              const keys = Object.keys(
                configurations,
              ) as (keyof typeof configurations)[];
              const index = keys.indexOf(tab);
              let next: number;
              if (event.key === "ArrowRight") next = (index + 1) % keys.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + keys.length) % keys.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = keys.length - 1;
              else return;
              event.preventDefault();
              setTab(keys[next]);
              document
                .getElementById(`tab-${keys[next].replaceAll(" ", "-")}`)
                ?.focus();
            }}
            onClick={() => setTab(name as keyof typeof configurations)}
          >
            {name}
          </button>
        ))}
      </div>
      <div
        id="config-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`tab-${tab.replaceAll(" ", "-")}`}
      >
        <CodeBlock
          code={configurations[tab]}
          title={
            tab === "Application" ? "app + domain configuration" : "uwas.yaml"
          }
          language="yaml"
        />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  const [tab, setTab] = useState("Domains");
  const rows =
    tab === "Domains"
      ? [
          ["example.com", "Static site", "Auto TLS"],
          ["blog.example.com", "WordPress", "Auto TLS"],
          ["api.example.com", "Reverse proxy", "Auto TLS"],
        ]
      : tab === "Applications"
        ? [
            ["storefront", "Node.js", "Running"],
            ["analytics-api", "Python", "Running"],
            ["worker", "Go", "Running"],
          ]
        : [
            ["edge-cache", "Memory + disk", "Enabled"],
            ["domain-backup", "S3 storage", "Scheduled"],
            ["metrics", "Prometheus", "Enabled"],
          ];
  return (
    <div className="dashboard-preview">
      <div className="dashboard-chrome">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>
          <LockKeyhole size={11} />
          127.0.0.1:9443/_uwas/dashboard/
        </span>
        <span className="demo-label">Illustrative preview</span>
      </div>
      <div className="dashboard-body">
        <div className="dashboard-sidebar">
          <LogoMark />
          {[
            [Globe2, "Domains"],
            [Box, "Applications"],
            [Layers3, "Services"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Globe2;
            return (
              <button
                key={String(label)}
                aria-label={String(label)}
                onClick={() => setTab(String(label))}
                aria-pressed={tab === label}
              >
                <I size={17} />
                <span>{String(label)}</span>
              </button>
            );
          })}
          <span className="dashboard-sidebar-end">
            <CircleDot size={14} /> Local instance
          </span>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-heading">
            <div>
              <span>WORKSPACE / OVERVIEW</span>
              <h3>{tab}</h3>
            </div>
            <span className="pill">
              <span className="status-dot" />
              Example workspace
            </span>
          </div>
          <div className="dashboard-stats">
            {[
              ["03", tab],
              ["Auto", "TLS management"],
              ["One", "Control plane"],
            ].map(([value, label]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <span className="stat-line" />
              </div>
            ))}
          </div>
          <div className="dashboard-table">
            <div className="dashboard-table-head">
              <span>{tab === "Domains" ? "DOMAIN" : "NAME"}</span>
              <span>TYPE</span>
              <span>STATUS</span>
            </div>
            {rows.map(([domain, type, status]) => (
              <div key={domain}>
                <span>
                  <span className="domain-symbol">
                    {domain.charAt(0).toUpperCase()}
                  </span>
                  {domain}
                </span>
                <span>{type}</span>
                <span className="healthy">
                  <span className="status-dot" />
                  {status}
                </span>
              </div>
            ))}
          </div>
          <div className="dashboard-note">
            <ShieldCheck size={14} />
            Your infrastructure, managed from one place.
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeBody() {
  return (
    <>
      <Hero />
      <TechnologyStrip />
      <StackComparison />
      <section className="container section">
        <Reveal>
          <div className="section-heading">
            <div>
              <span className="eyebrow">02 / BUILT IN, NOT BOLTED ON</span>
              <h2>
                Small footprint.
                <br />
                <span className="muted">A surprisingly big toolkit.</span>
              </h2>
            </div>
            <Link className="text-link" href="/features/">
              Explore all features
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
        <FeatureGrid />
      </section>
      <section className="config-section">
        <div className="container config-layout">
          <Reveal>
            <span className="eyebrow">03 / MAKE YOURSELF AT HOME</span>
            <h2>
              Readable config.
              <br />
              <span className="muted">Remarkable control.</span>
            </h2>
            <p>
              Static site? WordPress? An application behind a reverse proxy?
              Give it a domain and a few lines of YAML.
            </p>
            <ul className="check-list">
              <li>
                <Check />
                Automatic certificates and renewals
              </li>
              <li>
                <Check />
                Per-domain settings, one clear entry point
              </li>
              <li>
                <Check />
                Validate, reload, keep building
              </li>
            </ul>
            <Link href="/docs/configuration/" className="text-link">
              Meet your configuration
              <ArrowRight size={17} />
            </Link>
          </Reveal>
          <Reveal>
            <ConfigurationPlayground />
          </Reveal>
        </div>
      </section>
      <section className="container section dashboard-section">
        <Reveal>
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                04 / YOUR INFRASTRUCTURE, IN FOCUS
              </span>
              <h2>
                A control panel.
                <br />
                <span className="muted">Without another install.</span>
              </h2>
            </div>
            <p>
              Domains to databases. Deployments to diagnostics.
              <br />A complete view, included in the binary.
            </p>
          </div>
          <DashboardPreview />
          <div className="dashboard-below">
            <span>
              <strong>42</strong> dashboard pages
            </span>
            <span>
              <Terminal size={18} />
              CLI when you want it
            </span>
            <span>
              <Sparkles size={18} />
              MCP for your AI
            </span>
            <Link href="/docs/dashboard/" className="text-link">
              Take a closer look
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="ai-section">
        <div className="container ai-layout">
          <Reveal>
            <div className="eyebrow">05 / A NEW WAY TO OPERATE</div>
            <h2>
              Your server.
              <br />
              <span>An AI can talk to it.</span>
            </h2>
            <p>
              Built-in MCP brings structured server management to compatible AI
              tools. Inspect your infrastructure and manage it through a native
              interface.
            </p>
            <ButtonLink href="/docs/mcp/" secondary>
              Explore MCP
            </ButtonLink>
          </Reveal>
          <Reveal>
            <div className="mcp-card">
              <div className="mcp-card-top">
                <span>
                  <Sparkles size={17} />
                  UWAS MCP
                </span>
                <span className="pill">
                  <span className="status-dot" />
                  Built-in interface
                </span>
              </div>
              <div className="mcp-message">
                <span className="user-avatar">Y</span>
                <p>What’s running on my server?</p>
              </div>
              <div className="mcp-operation">
                <span className="mcp-tool">
                  <Terminal size={15} /> Structured management tools
                </span>
                <div>
                  <Check size={14} />
                  Inspect domains and server state
                </div>
                <div>
                  <Check size={14} />
                  Review cache and certificates
                </div>
                <div>
                  <Check size={14} />
                  Work through a compatible AI client
                </div>
              </div>
              <div className="mcp-card-bottom">
                <span className="status-dot" />
                Designed for your AI workflow<span>Illustrative workflow</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="container section faq-section">
        <Reveal>
          <div>
            <span className="eyebrow">A FEW THINGS YOU MIGHT WONDER</span>
            <h2>
              Good questions.
              <br />
              <span className="muted">Straight answers.</span>
            </h2>
            <Link href="/docs/" className="text-link">
              More in the docs
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
        <FAQ items={faqs} />
      </section>
    </>
  );
}
