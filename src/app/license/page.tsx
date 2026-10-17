import type { Metadata } from "next";
import { PageHeading, ButtonLink } from "@/components/ui";
import { REPO } from "@/lib/content";
export const metadata: Metadata = {
  title: "Licensing",
  description:
    "UWAS is available under AGPL-3.0 or a separate commercial license. Explore both options.",
  alternates: { canonical: "/license/" },
};
export default function License() {
  return (
    <>
      <PageHeading
        eyebrow="OPEN BY DESIGN"
        title={"Your infrastructure.\nA license that fits."}
        description="UWAS offers two licensing paths. The current upstream LICENSE file is the source of truth for the project’s terms."
      />
      <section className="container page-content">
        <div className="license-options">
          <article className="license-option featured">
            <span className="eyebrow">OPEN SOURCE</span>
            <h2>AGPL-3.0</h2>
            <p>
              Use, study, modify and redistribute UWAS under the GNU Affero
              General Public License, version 3 or later, as specified by
              upstream.
            </p>
            <p>
              Review the license’s source-sharing and network-use obligations,
              especially when modifying and operating the software for others.
            </p>
            <ButtonLink href={`${REPO}/blob/main/LICENSE`} external>
              Read the license
            </ButtonLink>
          </article>
          <article className="license-option">
            <span className="eyebrow">COMMERCIAL</span>
            <h2>Built around your needs.</h2>
            <p>
              For requirements that do not fit the AGPL terms, the project
              offers a separately negotiated commercial license.
            </p>
            <p>
              Discuss proprietary use, managed services, enterprise support or
              service-level requirements directly with the project.
            </p>
            <ButtonLink href="/enterprise/" secondary>
              Talk about enterprise
            </ButtonLink>
          </article>
        </div>
        <div className="article">
          <h2>Clear terms, current information.</h2>
          <p>
            Some older UWAS graphics mention Apache 2.0. The current repository
            defines dual AGPL-3.0 and commercial licensing. This website follows
            the current repository license.
          </p>
          <p>
            This page is a project overview. Read the full license and any
            commercial agreement for the terms that apply to your use.
          </p>
        </div>
      </section>
    </>
  );
}
