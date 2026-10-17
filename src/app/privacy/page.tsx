import type { Metadata } from "next";
import { PageHeading } from "@/components/ui";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How this UWAS website handles local preferences, external links and hosting.",
  alternates: { canonical: "/privacy/" },
};
export default function Privacy() {
  return (
    <>
      <PageHeading
        eyebrow="A SMALLER DATA FOOTPRINT"
        title="A straightforward website."
        description="This website is a static project site. It has no account system, advertising cookies or analytics SDK."
      />
      <article className="container article page-content">
        <h2>Your preferences stay in your browser.</h2>
        <p>
          The theme selector stores your light, dark or system preference in
          local storage under the key <code>uwas-theme</code>. Documentation
          search runs locally in your browser. The site does not send search
          queries to a search provider.
        </p>
        <h2>Hosting and external links.</h2>
        <p>
          The production deployment is designed for GitHub Pages. The hosting
          provider may process connection information such as IP addresses and
          request logs under its own policies. Links to GitHub and other
          external services are governed by those services’ privacy policies.
        </p>
        <h2>Self-hosted fonts.</h2>
        <p>
          Fonts are included in the website build. Loading a page does not
          require a request to a third-party font provider.
        </p>
        <h2>This site and your UWAS server.</h2>
        <p>
          This public website does not connect to your UWAS installation. The
          dashboard preview is an illustration, and its sample domains and
          application states are not live infrastructure data.
        </p>
        <h2>Questions.</h2>
        <p>
          For project questions, use the{" "}
          <a href="https://github.com/uwaserver/uwas/issues">
            UWAS issue tracker
          </a>
          . Do not post credentials, private server details or sensitive
          information in public issues.
        </p>
      </article>
    </>
  );
}
