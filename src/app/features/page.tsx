import type { Metadata } from "next";
import { FeatureGrid } from "@/components/home";
import { CTA, PageHeading } from "@/components/ui";
export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the UWAS web server, hosting panel, security controls and operations toolkit.",
  alternates: { canonical: "/features/" },
};
export default function FeaturesPage() {
  return (
    <>
      <PageHeading
        eyebrow="THE WHOLE TOOLKIT"
        title={"A lot more server.\nA lot less setup."}
        description="From the first TLS handshake to your next Git deployment. A connected set of tools for serving, managing and understanding your web infrastructure."
      />
      <section className="container page-content">
        <FeatureGrid all />
      </section>
      <CTA />
    </>
  );
}
