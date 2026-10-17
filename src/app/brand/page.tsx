import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHeading } from "@/components/ui";
import { Logo } from "@/components/brand";
export const metadata: Metadata = {
  title: "Brand assets",
  description:
    "Download the UWAS vector logo, symbol and color variants. A unified identity for a unified web stack.",
  alternates: { canonical: "/brand/" },
};
export default function Brand() {
  return (
    <>
      <PageHeading
        eyebrow="THE UWAS IDENTITY"
        title={"Many paths.\nOne unmistakable mark."}
        description="Converging blue arrows meet a strong U: a simple expression of an entire web stack coming together. Sharp at any size, from a favicon to a 4K screen."
      />
      <section className="container page-content">
        <div className="brand-showcase">
          <div className="brand-tile">
            <Logo />
            <a href="/brand/uwas-logo.svg" download>
              Download light SVG
              <Download size={14} />
            </a>
          </div>
          <div className="brand-tile dark">
            <Logo />
            <a href="/brand/uwas-logo-dark.svg" download>
              Download dark SVG
              <Download size={14} />
            </a>
          </div>
        </div>
        <div className="article">
          <h2>A practical palette.</h2>
          <p>
            Cobalt for connections. Ink for clarity. A light canvas that gives
            the details room to breathe.
          </p>
          <div className="palette">
            {[
              ["UWAS Blue", "#2563EB"],
              ["UWAS Ink", "#101C33"],
              ["Cloud", "#F7F9FC"],
              ["Signal Green", "#16805C"],
            ].map(([name, hex]) => (
              <div className="swatch" key={name}>
                <div className="swatch-color" style={{ background: hex }} />
                <div className="swatch-label">
                  {name}
                  <code>{hex}</code>
                </div>
              </div>
            ))}
          </div>
          <h2>Give the mark some room.</h2>
          <p>
            Keep clear space around the logo, preserve its proportions and
            choose a variant with enough contrast. Use the symbol at small
            sizes. Write the product name as UWAS, and use lowercase{" "}
            <code>uwas</code> for the command.
          </p>
          <div className="button-row">
            <a
              href="/brand/uwas-mark.svg"
              download
              className="button button-secondary"
            >
              Download symbol
              <Download size={15} />
            </a>
            <a
              href="/brand/uwas-logo-mono.svg"
              download
              className="button button-secondary"
            >
              Monochrome SVG
              <Download size={15} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
