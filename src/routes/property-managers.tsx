import { createFileRoute } from "@tanstack/react-router";
import { CtaBand } from "@/components/CtaBand";
import { HoaForm } from "@/components/HoaForm";
import { PageHero } from "@/components/layout/PageHero";
import { SiteShell } from "@/components/layout/SiteShell";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/property-managers")({
  component: ManagersPage,
  head: () => ({
    meta: [
      { title: "HOA & Property Manager Plumbing | Extreme Plumbing Los Angeles" },
      {
        name: "description",
        content:
          "Plumbing support for HOAs, property managers, and building engineers in Los Angeles. Common-area repairs, after-hours leaks, and a direct line to the shop.",
      },
    ],
    links: [{ rel: "canonical", href: canonical("/property-managers") }],
  }),
});

function ManagersPage() {
  return (
    <SiteShell>
      <main id="main">
        <PageHero
          kicker="HOAs · Property managers · Buildings"
          title="A plumber your board can actually reach."
          intro="Common-area leaks, stack backups, water heaters, and after-hours calls. One shop, a written estimate, and someone who answers."
        />
        <section className="py-14 md:py-20">
          <div className="shell grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="font-sans text-2xl font-semibold tracking-normal text-navy normal-case">What we take on</h2>
              <ul className="mt-4 grid gap-2 text-sm text-navy">
                {[
                  "After-hours leaks and shutoffs",
                  "Stack, drain, and cleanout work",
                  "Water heaters and boiler calls",
                  "Camera inspections before a bid",
                  "One point of contact for the manager",
                ].map((item) => (
                  <li key={item} className="border-t border-line py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <HoaForm />
          </div>
        </section>
        <CtaBand title="A building down right now?" />
      </main>
    </SiteShell>
  );
}
