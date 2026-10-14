export function PageHero({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-line bg-cream">
      <div className="shell py-14 md:py-20">
        <p className="kicker rule-draw">{kicker}</p>
        <h1 className="display max-w-3xl text-4xl text-navy md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{intro}</p>
      </div>
    </section>
  );
}
