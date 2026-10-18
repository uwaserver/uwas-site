"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Logo } from "./brand";
import { ThemePicker } from "./theme-picker";
import { AnimationToggle } from "./animation-toggle";
import { OxogStudio } from "./oxog-studio";
import { docs, REPO, VERSION } from "@/lib/content";

function Github({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .8A11.2 11.2 0 0 0 8.46 22.62c.56.1.77-.24.77-.54v-2.09c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.54 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.16a10.7 10.7 0 0 1 5.6 0c2.14-1.46 3.08-1.16 3.08-1.16.61 1.55.23 2.69.12 2.98.72.79 1.15 1.79 1.15 3.02 0 4.3-2.63 5.25-5.14 5.53.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduce ? {} : { y: [16, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.65, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CopyButton({
  text,
  label = false,
}: {
  text: string;
  label?: boolean;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Select and copy the code manually");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  }
  return (
    <span className="copy-wrap">
      <button
        className="copy-button"
        aria-label={status === "Copied" ? "Copied to clipboard" : "Copy code"}
        onClick={copy}
      >
        {status === "Copied" ? <Check size={16} /> : <Copy size={16} />}{" "}
        {label && <span>{status === "Copied" ? "Copied" : "Copy"}</span>}
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
      {status.length > 10 && (
        <span className="copy-error" role="alert">
          {status}
        </span>
      )}
    </span>
  );
}

function Highlight({ code }: { code: string }) {
  return (
    <>
      {code.split("\n").map((line, i) => (
        <span
          className={`code-line ${line.trim().startsWith("#") ? "comment" : ""}`}
          key={i}
        >
          {!line.trim().startsWith("#") && line.includes(":") ? (
            <>
              <span className="code-key">
                {line.slice(0, line.indexOf(":") + 1)}
              </span>
              {line.slice(line.indexOf(":") + 1)}
            </>
          ) : (
            line
          )}
          {"\n"}
        </span>
      ))}
    </>
  );
}

export function CodeBlock({
  code,
  title = "Terminal",
  language = "shell",
}: {
  code: string;
  title?: string;
  language?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-top">
        <span>
          <span className="terminal-dot" />
          {title}
        </span>
        <span className="code-lang">
          {language}
          <CopyButton text={code} />
        </span>
      </div>
      <pre>
        <code>
          <Highlight code={code} />
        </code>
      </pre>
    </div>
  );
}

export function ButtonLink({
  children,
  href,
  secondary = false,
  external = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  secondary?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : "button-primary"} ${className}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {children}
      {external ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}
    </Link>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    function keys(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, []);
  const links = [
    ["Features", "/features/"],
    ["Use cases", "/use-cases/"],
    ["Documentation", "/docs/"],
    ["Changelog", "/changelog/"],
  ];
  return (
    <>
      <div className="announcement">
        <Link href="/changelog/">
          <span className="announcement-pill">{VERSION}</span> A little less
          stack. A lot more server. <ArrowRight size={14} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" aria-label="UWAS home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link
                aria-current={path.startsWith(href) ? "page" : undefined}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              aria-label="Search documentation"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} />
              <kbd>⌘ K</kbd>
            </button>
            <ThemePicker />
            <AnimationToggle />
            <a
              className="github-link"
              href={REPO}
              target="_blank"
              rel="noreferrer"
              aria-label="UWAS on GitHub"
            >
              <Github size={19} />
              <span>GitHub</span>
              <ArrowUpRight size={13} />
            </a>
            <button
              className="icon-button mobile-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {links.map(([label, href]) => (
              <Link href={href} key={href} onClick={() => setOpen(false)}>
                {label}
                <ArrowRight size={16} />
              </Link>
            ))}
            <Link href="/docs/getting-started/" onClick={() => setOpen(false)}>
              Get started
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search size={16} /> Search documentation
            </button>
          </nav>
        )}
      </header>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = docs.filter((d) =>
    `${d.title} ${d.summary} ${d.sections.map((s) => `${s.title} ${s.body}`).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    input.current?.focus();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="search-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label="Search documentation"
    >
      <div className="search-input">
        <Search size={21} />
        <input
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation…"
          aria-label="Search documentation pages"
        />
        <button
          onClick={onClose}
          className="icon-button"
          aria-label="Close search"
        >
          <X size={19} />
        </button>
      </div>
      <div className="search-results">
        {results.length ? (
          results.map((doc) => (
            <Link href={`/docs/${doc.slug}/`} key={doc.slug} onClick={onClose}>
              <span>
                <small>{doc.category}</small>
                <strong>{doc.title}</strong>
                <span>{doc.summary}</span>
              </span>
              <ChevronRight size={18} />
            </Link>
          ))
        ) : (
          <div className="search-empty">
            <Search size={28} />
            <h3>No results for “{query}”</h3>
            <p>Try “PHP”, “HTTPS” or “configuration”.</p>
            <button
              className="button button-secondary"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      <div className="search-bottom">
        <span>{results.length} guides · Search runs on your device</span>
        <kbd>esc to close</kbd>
      </div>
    </dialog>
  );
}

export function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        ["Features", "/features/"],
        ["Use cases", "/use-cases/"],
        ["Download", "/download/"],
        ["Architecture", "/architecture/"],
        ["Changelog", "/changelog/"],
      ],
    },
    {
      title: "Resources",
      links: [
        ["Get started", "/docs/getting-started/"],
        ["Documentation", "/docs/"],
        ["Brand assets", "/brand/"],
        ["GitHub", REPO],
      ],
    },
    {
      title: "Project",
      links: [
        ["Licensing", "/license/"],
        ["Enterprise", "/enterprise/"],
        ["Security", `${REPO}/security`],
        ["Privacy", "/privacy/"],
      ],
    },
  ];
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="UWAS home">
            <Logo />
          </Link>
          <p>
            Unified Web Application Server.
            <br />
            Less to manage. More to make.
          </p>
          <span className="footer-made">Built in Go. Made for the web.</span>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3>{col.title}</h3>
            {col.links.map(([label, href]) => (
              <Link href={href} key={label}>
                {label}
                {href.startsWith("https") && <ArrowUpRight size={12} />}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <OxogStudio />
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} UWAS contributors.</span>
        <span>AGPL-3.0 + commercial licensing</span>
        <a
          href={`${REPO}/releases/tag/${VERSION}`}
          className="release-indicator"
        >
          <span className="status-dot" />
          {VERSION}
        </a>
      </div>
    </footer>
  );
}

export function CTA() {
  return (
    <section className="container cta-section">
      <Reveal>
        <div className="cta-card">
          <div className="cta-grid" aria-hidden="true" />
          <span className="eyebrow">YOUR NEXT DEPLOYMENT STARTS HERE</span>
          <h2>
            Less stack.
            <br />
            <span>More possibility.</span>
          </h2>
          <p>
            Your domains, your applications, your infrastructure.
            <br />
            Bring them together with UWAS.
          </p>
          <div className="button-row">
            <ButtonLink href="/docs/getting-started/">Get started</ButtonLink>
            <ButtonLink href={REPO} external secondary>
              Explore the source
            </ButtonLink>
          </div>
          <span className="cta-footnote">
            Open source · Self-hosted · Built in Go
          </span>
        </div>
      </Reveal>
    </section>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="container page-heading">
      <span className="eyebrow">
        <span className="tiny-square" />
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <span className="faq-plus">+</span>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
