import { reviews } from "@/lib/site";

type Review = (typeof reviews)[number];

function Stars({ value }: { value: number }) {
  return (
    <span className="tracking-tight text-[#fbbc04]" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(value)}
      <span className="text-[#dadce0]">{"★".repeat(5 - value)}</span>
    </span>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const tone = review.source === "Yelp" ? "bg-[#d32323]" : review.source === "Angi" ? "bg-[#ff6b35]" : "bg-[#1a73e8]";
  return (
    <article className="card-lift rounded-lg border border-[#dadce0] bg-white p-4 text-ink shadow-[0_1px_2px_rgba(60,64,67,0.15)]">
      <header className="flex items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white ${tone}`}>
          {review.name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#202124]">{review.name}</p>
          <p className="text-xs text-[#70757a]">
            {review.when ? (
              <>
                {review.when}
                <span className="mx-1">·</span>
              </>
            ) : null}
            {review.source}
          </p>
          {review.stars ? <Stars value={review.stars} /> : null}
        </div>
      </header>
      <p className="mt-3 text-sm leading-relaxed text-[#3c4043]">{review.quote}</p>
      {"href" in review && review.href ? (
        <a href={review.href} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-[#d32323]">
          Full review on Yelp
        </a>
      ) : null}
    </article>
  );
}

export function ReviewSummary() {
  const yelpBars = [
    { star: 5, count: 222 },
    { star: 4, count: 4 },
    { star: 3, count: 4 },
    { star: 2, count: 4 },
    { star: 1, count: 18 },
  ];
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="text-sm font-semibold text-[#d32323]">Yelp</p>
        <p className="mt-2 font-sans text-5xl leading-none font-medium tracking-normal text-[#202124] normal-case">4.6</p>
        <p className="mt-2 text-lg tracking-tight text-[#d32323]" aria-label="4.6 out of 5 on Yelp">
          ★★★★★
        </p>
        <p className="mt-1 text-sm text-[#70757a]">252 Yelp reviews · Van Nuys</p>
        <div className="mt-4 grid max-w-xs gap-1 text-xs text-[#70757a]">
          {yelpBars.map((row) => (
            <div key={row.star} className="grid grid-cols-[1.5rem_1fr_2rem] items-center gap-2">
              <span>{row.star}</span>
              <span className="h-2 overflow-hidden rounded-full bg-[#e8eaed]">
                <span
                  className="meter block h-full rounded-full bg-[#d32323]"
                  style={{ width: `${Math.round((row.count / 252) * 100)}%` }}
                />
              </span>
              <span>{row.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1a73e8]">Google</p>
        <p className="mt-2 font-sans text-5xl leading-none font-medium tracking-normal text-[#202124] normal-case">5.0</p>
        <p className="mt-2 text-lg tracking-tight text-[#fbbc04]" aria-hidden="true">
          ★★★★★
        </p>
        <p className="mt-1 text-sm text-[#70757a]">Featured Google reviews, quoted as published</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#3c4043]">
          The cards are quotes we can verify. Job photos stay on the Yelp listing rather than being paired with the wrong review.
        </p>
      </div>
    </div>
  );
}
