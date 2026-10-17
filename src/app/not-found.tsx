import { ButtonLink } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">404 / ROUTE NOT FOUND</span>
      <h1>A path less served.</h1>
      <p>This page isn’t here. Let’s get you back to a route that works.</p>
      <div className="button-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink secondary href="/docs/">
          Find it in the docs
        </ButtonLink>
      </div>
    </section>
  );
}
