import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { Analytics } from "@/components/Analytics";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { EMAIL, LICENSE_NUMBER, PHONE_HREF, SITE_URL, areas, socialLinks } from "@/lib/site";
import appCss from "../styles.css?url";

const APP_NAME = "Extreme Plumbing & Rooter";
const DESCRIPTION =
  "24/7 plumbing and rooter service throughout Los Angeles. Camera inspections, drain cleaning, sewer replacement, and free no-pressure estimates.";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: "Extreme Plumbing & Rooter, Inc.",
  url: SITE_URL,
  telephone: PHONE_HREF.replace("tel:", ""),
  email: EMAIL,
  foundingDate: "1997",
  priceRange: "$$",
  image: `${SITE_URL}/media/logo.png`,
  identifier: {
    "@type": "PropertyValue",
    name: "California contractor license",
    value: LICENSE_NUMBER,
  },
  address: {
    "@type": "PostalAddress",
    postOfficeBoxNumber: "14641",
    addressLocality: "Van Nuys",
    addressRegion: "CA",
    postalCode: "91409",
    addressCountry: "US",
  },
  areaServed: areas.map((name) => ({ "@type": "City", name })),
  openingHours: "Mo-Su 00:00-23:59",
  sameAs: socialLinks.map((item) => item.href),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  url: SITE_URL,
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#071525" },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3T17L2W33Z" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-3T17L2W33Z');`,
          }}
        />
        <HeadContent />
      </head>
      <body className="bg-paper text-ink">
        <PreviewHostBridge />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <AuthProvider>
          <Analytics />
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
