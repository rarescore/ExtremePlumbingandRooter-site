export const PHONE_DISPLAY = "818-631-7296";
export const PHONE_HREF = "tel:+18186317296";
export const EMAIL = "extreme.plumbing@yahoo.com";
export const LICENSE_NUMBER = "1086230";
export const SITE_URL = "https://www.rooter-plumber.com";
export const COMPANY = "Extreme Plumbing & Rooter";
export const COMPANY_LEGAL = "Extreme Plumbing & Rooter, Inc.";

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "Our Team", href: "/our-workers" },
  { label: "Reviews", href: "/reviews" },
  { label: "HOA Signup", href: "/property-managers" },
  { label: "FAQ", href: "/faq" },
  { label: "Articles", href: "/articles" },
] as const;

export const socialLinks = [
  {
    label: "Google Reviews",
    shortLabel: "Google",
    href: "https://www.google.com/search?q=extreme+plumbing+and+rooter",
  },
  {
    label: "Yelp Reviews",
    shortLabel: "Yelp",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4",
  },
  {
    label: "Instagram",
    shortLabel: "Instagram",
    href: "https://www.instagram.com/extremeplumbingandrooter/",
  },
  {
    label: "Facebook",
    shortLabel: "Facebook",
    href: "https://www.facebook.com/ExtremeRooter/",
  },
  {
    label: "TikTok",
    shortLabel: "TikTok",
    href: "https://www.tiktok.com/@extremeplumbingandrooter",
  },
] as const;

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  image: string;
  alt: string;
  highlights: string[];
  signs: string[];
  process: string;
};

export const services: Service[] = [
  {
    slug: "drain-cleaning-rooter-service",
    title: "Drain Cleaning & Rooter",
    short: "Clear stubborn clogs, backups, roots, and buildup.",
    description:
      "Don’t let a clogged drain slow the house down. We clear kitchen, bath, and main-line stoppages with professional rooter equipment, then explain why it happened so it is less likely to come back.",
    image: "/media/drain-cleaning.jpg",
    alt: "Professional drain cleaning machine at a residential cleanout",
    highlights: ["Kitchen and bathroom drains", "Main-line rooter service", "Recurring blockage diagnosis"],
    signs: ["Water backing up in a sink, tub, or floor drain", "Gurgling toilets when another fixture runs", "Slow drains in more than one room"],
    process:
      "We locate the stoppage, run the right cable or jetter for the pipe, and check flow before we leave. If the clog keeps returning, a camera inspection shows whether roots, a belly, or a break is the real cause.",
  },
  {
    slug: "trenchless-sewer-replacement",
    title: "Trenchless Sewer Replacement",
    short: "Repair sewer lines with less digging and disruption.",
    description:
      "A failing sewer line does not always mean tearing up the driveway. Trenchless replacement pulls a new pipe through the existing path, so landscaping, concrete, and daily life stay mostly intact.",
    image: "/media/trenchless-sewer.jpg",
    alt: "Trenchless sewer replacement access pit in a Los Angeles driveway",
    highlights: ["Minimal excavation", "Durable modern materials", "Camera-guided planning"],
    signs: ["Repeated sewer backups", "Lush or soggy strips in the yard", "Toilet water that rises when a sink drains"],
    process:
      "A camera maps the line first. We open small access points, pull or burst in a new pipe, then re-inspect so you can see the finished result on screen.",
  },
  {
    slug: "water-heaters",
    title: "Water Heaters",
    short: "Reliable hot water — repairs and replacements done right.",
    description:
      "No hot water, rusty water, or a tank that pops and hisses is not something to wait on. We service traditional tanks and tankless systems, size replacements for the house, and install them to code.",
    image: "/media/water-heaters.jpg",
    alt: "Newly installed residential tank water heater in a California garage",
    highlights: ["Tank and tankless systems", "Repair and replacement", "Efficiency guidance"],
    signs: ["No hot water or water that does not stay hot", "Rust-colored water from hot taps", "Water around the base of the tank"],
    process:
      "We test the unit, check valves, vents, and connections, then give you a clear repair-versus-replace recommendation before any work starts.",
  },
  {
    slug: "copper-repipe",
    title: "Copper Repipe",
    short: "Upgrade aging or restricted water lines.",
    description:
      "Green copper, pinholes, and weak pressure are common in older Los Angeles homes. A copper repipe replaces failing supply lines with a durable, corrosion-resistant system sized for modern fixtures.",
    image: "/media/copper-repipe.jpg",
    alt: "New copper water pipes installed in an opened residential wall",
    highlights: ["Whole-home repiping", "Water-pressure improvement", "Residential and commercial"],
    signs: ["Green staining on copper pipes", "Repeated pinhole leaks", "Low pressure at several fixtures"],
    process:
      "We plan the run, protect floors and furnishings, replace the failing lines, and restore walls as agreed. You get a walkthrough of shutoffs and the new layout.",
  },
  {
    slug: "hydro-jetter",
    title: "Hydro-Jetting",
    short: "High-pressure cleaning for grease, roots, and scale.",
    description:
      "Snaking punches a hole through a clog. Hydro-jetting scours the pipe wall with controlled high-pressure water, clearing grease, scale, and root hairs that a cable leaves behind.",
    image: "/media/hydro-jetting.jpg",
    alt: "Hydro-jetting hose working a sewer cleanout in a driveway",
    highlights: ["Deep pipe cleaning", "Grease and scale removal", "Preventive maintenance"],
    signs: ["Drains that clog again a few weeks after snaking", "Grease buildup in restaurant or kitchen lines", "Root hairs visible on a camera inspection"],
    process:
      "We confirm the pipe is sound with a camera, then jet at a pressure the line can handle. A second look on camera shows a clean interior before we pack up.",
  },
  {
    slug: "camera-inspection",
    title: "Camera Inspection",
    short: "See the actual cause before choosing a repair.",
    description:
      "Guessing is expensive. A sewer camera is a lighted, waterproof video head on a push cable. We feed it through a cleanout and watch the inside of the line live — roots, cracks, offsets, grease, collapsed sections — then show you the recording and mark the location above ground.",
    image: "/media/camera-inspection.jpg",
    alt: "Sewer inspection camera reel and monitor showing the inside of a pipe",
    highlights: ["Live video of the pipe interior", "Problem-location mapping", "Repair verification"],
    signs: ["Recurring clogs with no obvious cause", "Buying or selling a home", "Odors, slow drains, or a suspected broken sewer"],
    process:
      "We access a cleanout or pull a toilet if needed, run the camera the length of the line, and pause on every defect. You watch with us. Recommendations and a free estimate follow — no digging until you approve a plan.",
  },
  {
    slug: "boilers-replace-repairs",
    title: "Boiler Repair & Replacement",
    short: "Restore dependable heating and hot-water performance.",
    description:
      "Boilers are a different machine from a tank water heater. We diagnose pressure, ignition, circulation, and heat-exchanger problems, complete practical repairs, and plan a replacement when the unit is at the end of its life.",
    image: "/media/boilers.jpg",
    alt: "Residential hydronic boiler with gauges and heating pipes",
    highlights: ["Troubleshooting and repair", "Replacement planning", "System maintenance"],
    signs: ["No heat or uneven heat", "Pressure dropping or relief valve discharging", "Unusual banging or kettling noises"],
    process:
      "We isolate the fault, explain the options in plain language, and only replace what the system actually needs.",
  },
  {
    slug: "leak-detection",
    title: "Leak Detection",
    short: "Find hidden leaks before the damage spreads.",
    description:
      "A hidden leak rarely announces itself with a puddle. We use acoustic listening, moisture readings, and line tracing to find supply and slab leaks without opening every wall.",
    image: "/media/leak-detection.jpg",
    alt: "Technician using an electronic leak detector on an interior wall",
    highlights: ["Hidden water leaks", "Fixture and supply lines", "Targeted diagnosis"],
    signs: ["Unexplained spike in the water bill", "Warm spots on a slab", "Stains, peeling paint, or the sound of running water"],
    process:
      "We start at the meter and fixtures, then narrow to the line. You get a marked location and an estimate for the repair — not a demolished wall on a hunch.",
  },
  {
    slug: "high-rise-buildings",
    title: "High-Rise Plumbing",
    short: "Complex plumbing support for multi-story properties.",
    description:
      "High-rise systems need pressure regulation, vertical distribution, and drainage that a house does not. We work with property managers and building engineers on risers, booster pumps, stacks, and unit-level repairs.",
    image: "/media/high-rise.jpg",
    alt: "Commercial high-rise mechanical room with vertical pipe risers",
    highlights: ["Pressure regulation", "Vertical distribution systems", "Commercial maintenance"],
    signs: ["Pressure problems on upper floors", "Stack backups affecting multiple units", "Aging risers or booster equipment"],
    process:
      "We coordinate access, isolate the affected zone, and keep occupied floors in mind. Clear options, written estimates, and work that respects the building.",
  },
];

export const areas = [
  "Los Angeles",
  "Van Nuys",
  "Sherman Oaks",
  "North Hollywood",
  "Valley Village",
  "Toluca Lake",
  "Northridge",
  "Glendale",
  "Studio City",
  "Calabasas",
  "Beverly Hills",
  "Woodland Hills",
  "Pasadena",
  "Santa Monica",
  "Porter Ranch",
  "Santa Clarita",
] as const;

export const reviews = [
  {
    name: "Gina G.",
    source: "Google",
    stars: 5,
    when: "",
    quote:
      "Hakop recognized the situation right away and got to work. The job was done very clean and very fast. That kind of service is rare these days.",
  },
  {
    name: "Gayush G.",
    source: "Google",
    stars: 5,
    when: "",
    quote:
      "He knew what was going on, was very professional, and finished the work quickly and cleanly. We were extremely happy with the service.",
  },
  {
    name: "Tom M.",
    source: "Google",
    stars: 5,
    when: "",
    quote:
      "They quickly diagnosed the problems and installed a new garbage disposal and toilet in just a few hours. I would highly recommend them.",
  },
  {
    name: "Johnny K.",
    source: "Google",
    stars: 5,
    when: "",
    quote: "They came out the same day and repaired the outdoor leak quickly. Great service from start to finish.",
  },
  {
    name: "Luz O.",
    source: "Google",
    stars: 5,
    when: "",
    quote: "Hakob and Arman arrived quickly, stopped a kitchen flooding problem, and treated us with genuine kindness.",
  },
  {
    name: "Leo G.",
    source: "Google",
    stars: 5,
    when: "",
    quote: "Larry was exceptionally kind and professional. I would gladly recommend working with him.",
  },
  {
    name: "David D.",
    source: "Yelp",
    stars: null,
    when: "Jul 30, 2026",
    quote:
      "Great service. Showed up in a reasonable amount of time for my leaky toilet. Knowledgeable plumbers and their experience showed.",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4?hrid=ntsIzVpUiRHpP36Id_8u4w",
  },
  {
    name: "Bradley J.",
    source: "Yelp",
    stars: null,
    when: "Jul 30, 2026",
    quote:
      "Great customer service from beginning to end. Alen was able to diagnose and fix our shower at a reasonable price and established trust. Will definitely call on him again.",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4?hrid=RcO-jZiapqSR0skJeBeWbQ",
  },
  {
    name: "Kazumi M.",
    source: "Yelp",
    stars: null,
    when: "Jun 27, 2026",
    quote:
      "Alen came out yesterday did a fantastic job. He took the time to really explain what was going on, which I appreciated, and he went above and beyond with the work itself.",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4?hrid=QXbC2ZdzOna7PrbTwWZW_A",
  },
  {
    name: "Mike S.",
    source: "Yelp",
    stars: null,
    when: "Aug 22, 2026",
    quote:
      "I called Extreme Plumbing for a backed up sewage system which had overflowed into our shower and master bathroom. Alen was our main contact, although the entire team worked hard to restore our…",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4?hrid=SRNyi4M04CDv-LsqvAw_0Q",
  },
  {
    name: "Steve S.",
    source: "Yelp",
    stars: null,
    when: "Aug 19, 2025",
    quote:
      "I needed to get a sewer camera inspection done for one of my projects. The guys squeezed me in the same day and did an excellent job at a reasonable price. The communication was great all…",
    href: "https://www.yelp.com/biz/extreme-plumbing-and-rooter-van-nuys-4?hrid=Ik2m455E4mUvfUoZ6KyfFA",
  },
  {
    name: "Oleg R.",
    source: "Angi",
    stars: 5,
    when: "May 2016",
    quote:
      "Everything went extremely well. The provider was punctual, honest, and sincere. If there were problems, he would tell us right away. Abe checked the previous plumber’s work and broke the price down so we knew what each part cost.",
  },
  {
    name: "Leo D.",
    source: "Angi",
    stars: 5,
    when: "December 2017",
    quote:
      "Every single employee at this company is great! They answer all of your questions without getting annoyed. They are on time and they finished before the deadline. I will 100% use them again.",
  },
  {
    name: "Armen P.",
    source: "Angi",
    stars: 5,
    when: "December 2017",
    quote:
      "Extreme Plumbing and Rooter not only met my expectations, they exceeded them. Very professional, honest, easy-going. Definitely a company I would rehire and recommend to friends and family.",
  },
  {
    name: "Gevorg K.",
    source: "Angi",
    stars: 5,
    when: "September 2017",
    quote:
      "At first we had hired another company. They didn’t fix the problem correctly, so I called Extreme Plumbing and Rooter. They really know their job. They’re great with their customers and great guys.",
  },
  {
    name: "Avetis S.",
    source: "Angi",
    stars: 5,
    when: "December 2017",
    quote: "Great service. Great guy. Comes on time and he is honest.",
  },
] as const;

export const faqs: { q: string; a: string }[] = [
  {
    q: "Is the estimate really free?",
    a: "Yes. We come out, inspect the issue, explain what we find, and give you a quote before work begins. There is no obligation to approve the repair.",
  },
  {
    q: "Do you offer emergency plumbing service?",
    a: "Yes. Extreme Plumbing & Rooter is available 24 hours a day, 7 days a week for urgent plumbing problems across greater Los Angeles.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the greater Los Angeles area, including the San Fernando Valley and many surrounding communities. If you do not see your city listed, call — we can often still help.",
  },
  {
    q: "Will you explain the price before starting?",
    a: "Yes. You get a clear recommendation and an upfront estimate. Work begins only if you approve it. No surprise invoices.",
  },
  {
    q: "Do you work on homes and businesses?",
    a: "Yes. We handle residential and commercial plumbing, including high-rise and multi-unit properties.",
  },
  {
    q: "What should I do during a major leak?",
    a: "If it is safe, shut off the nearest fixture valve or the property’s main water supply, stay clear of electrical hazards, and call us at 818-631-7296.",
  },
  {
    q: "What is a camera inspection, exactly?",
    a: "It is a live video of the inside of your drain or sewer line. A small waterproof camera on a cable shows roots, cracks, offsets, and blockages so the repair is based on what is actually there — not a guess.",
  },
  {
    q: "Are you licensed?",
    a: "Yes. Extreme Plumbing & Rooter, Inc. is a licensed California contractor, license #1086230.",
  },
];

export const team = [
  { src: "/media/team/team-member-01.jpg", alt: "Extreme Plumbing field technician in company polo" },
  { src: "/media/team/team-member-02.jpg", alt: "Extreme Plumbing technician standing in the shop" },
  { src: "/media/team/team-member-03.jpg", alt: "Extreme Plumbing crew member in the warehouse" },
  { src: "/media/team/team-member-04.jpg", alt: "Extreme Plumbing technician with a tool bag" },
  { src: "/media/team/team-member-05.jpg", alt: "Extreme Plumbing technician" },
  { src: "/media/team/team-member-06.jpg", alt: "Extreme Plumbing crew member by a service van" },
  { src: "/media/team/team-member-07.jpg", alt: "Extreme Plumbing technician in the shop aisle" },
  { src: "/media/team/team-member-08.jpg", alt: "Extreme Plumbing crew member" },
] as const;

export const processSteps = [
  {
    n: "01",
    title: "Tell us what’s happening",
    copy: "Call or send a short message. A slow drain, a backup, no hot water — describe what you see.",
  },
  {
    n: "02",
    title: "We inspect the problem",
    copy: "A technician evaluates the system. When it helps, we run a camera so you can see the cause yourself.",
  },
  {
    n: "03",
    title: "You approve the estimate",
    copy: "Clear options and a price. Work starts only if you say so. No pressure, no surprises.",
  },
] as const;

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function canonical(path = "/") {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  return `${SITE_URL}${clean}`;
}
