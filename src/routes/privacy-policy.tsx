import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF, canonical } from "@/lib/site";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | Extreme Plumbing & Rooter" },
      {
        name: "description",
        content: "Privacy policy for Extreme Plumbing & Rooter website visitors and estimate requests.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/privacy-policy") }],
  }),
});

function PrivacyPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="Effective January 22, 2026"
          title="Privacy policy."
          intro="How Extreme Plumbing collects and uses information when you visit the site or request service."
        />
        <section className="py-16 md:py-24">
          <article className="shell article-prose max-w-[68ch]">
            <h2>Information we collect</h2>
            <p>
              When you request an estimate or contact us, we may collect your name, phone number, email address,
              preferred appointment date and time, service details, and related communications. We may also receive
              basic technical information associated with your visit.
            </p>
            <h2>How we use information</h2>
            <p>
              We use this information to respond to requests, schedule service, provide estimates and service updates,
              improve our website and customer experience, prevent misuse, and comply with legal obligations.
            </p>
            <h2>Sharing</h2>
            <p>
              We do not sell personal information. We may share information with service providers who help us operate
              the website or communicate with you, or when required by law.
            </p>
            <h2>Communications</h2>
            <p>
              If you contact us by form, phone, email, or text, we may reply using the same channel. You can ask us to
              stop promotional messages at any time. Service-related messages about a request you initiated may still
              be necessary.
            </p>
            <h2>Retention</h2>
            <p>
              We keep contact and job-related information as long as needed to provide service, maintain records, and
              meet legal requirements, then delete or de-identify it when it is no longer needed.
            </p>
            <h2>Your choices</h2>
            <p>
              You may request access, correction, or deletion of personal information we hold about you, subject to
              legal exceptions. Contact us using the details below.
            </p>
            <h2>Contact</h2>
            <p>
              Extreme Plumbing & Rooter, Inc.
              <br />
              P.O. Box 14641, Van Nuys, CA 91409
              <br />
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
              <br />
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
          </article>
        </section>
      </main>
    </SiteShell>
  );
}
