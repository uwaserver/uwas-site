import type { Metadata } from "next";
import { ArrowUpRight, Download, ShieldCheck } from "lucide-react";
import { PageHeading, CodeBlock } from "@/components/ui";
import { INSTALL, REPO, VERSION } from "@/lib/content";
export const metadata: Metadata = {
  title: "Download",
  description:
    "Download verified UWAS release assets for Linux, macOS and Windows, or install with one command.",
  alternates: { canonical: "/download/" },
};
const assets = [
  ["Linux", "x86-64", "uwas-linux-amd64", "17.7 MB"],
  ["Linux", "ARM64", "uwas-linux-arm64", "16.4 MB"],
  ["macOS", "Intel", "uwas-darwin-amd64", "18.0 MB"],
  ["macOS", "Apple Silicon", "uwas-darwin-arm64", "16.9 MB"],
  ["Windows", "x86-64", "uwas-windows-amd64.exe", "18.0 MB"],
];
export default function DownloadPage() {
  return (
    <>
      <PageHeading
        eyebrow={`${VERSION} / RELEASE BINARIES`}
        title={"Small download.\nA complete foundation."}
        description="Choose your platform or use the upstream installer on Linux and macOS. Binary links below refer to the current reviewed release."
      />
      <section className="container page-content">
        <div className="download-intro">
          <CodeBlock code={INSTALL} title="Linux / macOS installer" />
          <p>
            Prefer to inspect first?{" "}
            <a className="text-link" href={`${REPO}/blob/main/install.sh`}>
              Read the installation script
              <ArrowUpRight size={14} />
            </a>
          </p>
        </div>
        <div className="download-grid">
          {assets.map(([platform, arch, file, size]) => (
            <a
              className="download-card"
              key={file}
              href={`${REPO}/releases/download/${VERSION}/${file}`}
            >
              <span className="eyebrow">{platform}</span>
              <h2>{arch}</h2>
              <span className="download-file">{file}</span>
              <div>
                <span>
                  {VERSION} · {size}
                </span>
                <Download size={18} />
              </div>
            </a>
          ))}
        </div>
        <aside className="callout">
          <ShieldCheck size={18} /> Verify the downloaded file against the
          release’s{" "}
          <a
            className="text-link"
            href={`${REPO}/releases/download/${VERSION}/SHA256SUMS`}
          >
            SHA256SUMS
            <ArrowUpRight size={13} />
          </a>
          . Windows binaries are available; Linux systemd and hosting
          integrations are platform-specific.
        </aside>
        <a className="button button-secondary" href={`${REPO}/releases`}>
          All releases and assets
          <ArrowUpRight size={16} />
        </a>
      </section>
    </>
  );
}
