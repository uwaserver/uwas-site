import type { Metadata } from "next";
import { PageHeading, ButtonLink } from "@/components/ui";
export const metadata: Metadata = {
  title: "Enterprise",
  description:
    "Discuss commercial UWAS licensing, proprietary use and enterprise support with the project.",
  alternates: { canonical: "/enterprise/" },
};
export default function Enterprise() {
  return (
    <>
      <PageHeading
        eyebrow="LET’S TALK INFRASTRUCTURE"
        title={"Your requirements.\nA direct conversation."}
        description="Need a commercial license or want to discuss enterprise support? Tell us what you’re building, and what you need from your web platform."
      />
      <section className="container page-content">
        <div className="editorial-grid">
          <article className="editorial-card">
            <h2>Commercial licensing</h2>
            <p>
              A separate commercial license is available for use cases that do
              not fit the AGPL-3.0 terms. Pricing, rights and support are
              negotiated per customer.
            </p>
            <ul>
              <li>Proprietary product integration</li>
              <li>Managed hosting requirements</li>
              <li>Enterprise support and SLA discussions</li>
            </ul>
            <ButtonLink href="mailto:license@uwaserver.com">
              Contact licensing
            </ButtonLink>
          </article>
          <article className="editorial-card">
            <h2>Bring a little context.</h2>
            <p>
              Help the team understand the deployment you have in mind. Include
              your organization, expected usage, required integrations and the
              support you are looking for.
            </p>
            <p>
              The project does not publish fixed enterprise packages or
              guaranteed response times. Specific commitments belong in your
              agreement.
            </p>
            <a className="text-link" href="mailto:license@uwaserver.com">
              license@uwaserver.com
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
