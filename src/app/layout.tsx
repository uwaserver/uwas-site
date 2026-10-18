import type { Metadata, Viewport } from "next";
import { Footer, Header } from "@/components/ui";
import { REPO } from "@/lib/content";
import { SiteBackground } from "@/components/site-background";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://uwaserver.com"),
  title: {
    default: "UWAS — One binary. Your entire web stack.",
    template: "%s | UWAS",
  },
  description:
    "The web server, reverse proxy, cache and hosting panel. Together at last. UWAS unifies your web stack in one Go binary, with automatic HTTPS and built-in MCP.",
  applicationName: "UWAS",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "UWAS",
    title: "UWAS — One binary. Your entire web stack.",
    description:
      "Less infrastructure to manage. More room to build. Meet the unified web application server.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "UWAS — One binary. Your entire web stack.",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b101b" },
  ],
};

const themeScript = `try{var t=localStorage.getItem('uwas-theme')||'system';document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteBackground />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "UWAS",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Linux, macOS",
              url: "https://uwaserver.com",
              codeRepository: REPO,
              description:
                "Unified Web Application Server. A web server and hosting control panel in a single Go binary.",
              license: `${REPO}/blob/main/LICENSE`,
            }),
          }}
        />
      </body>
    </html>
  );
}
