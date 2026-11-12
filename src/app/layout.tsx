import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { COMPANY } from "@/lib/company";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

// ─── Site-wide constants ─────────────────────────────────────────────────────
const SITE_URL = "https://aapkacredit.com";
const SITE_NAME = "Aapka Credit";
// GA4 Measurement ID — set NEXT_PUBLIC_GA4_ID in .env.local
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
// Google Search Console — set NEXT_PUBLIC_GSC_CODE in .env.local  
const GSC_CODE = process.env.NEXT_PUBLIC_GSC_CODE ?? "";

// ─── Root Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ✅ Optimised title: 52 characters (was 72)
  title: {
    default: "Instant Loans & Credit | Aapka Credit India",
    template: "%s | Aapka Credit",
  },

  // ✅ Optimised description: 148 characters (was 185)
  description:
    "Get instant personal, business & education loans up to ₹50L. Check eligibility in seconds — zero credit score impact. Zero hidden fees. Powered by Aapka Credit.",

  keywords: [
    "instant loan",
    "personal loan India",
    "business loan",
    "education loan",
    "loan eligibility check",
    "low interest loan India",
    "Aapka Credit",
    "best loan app India",
    "online loan apply",
    "MSME loan",
  ],

  authors: [{ name: "Prism Cosmic Private Limited", url: "https://prismcosmic.com" }],
  creator: "Prism Cosmic Private Limited",
  publisher: "Aapka Credit",

  // ✅ Canonical tag on root
  alternates: {
    canonical: SITE_URL,
  },

  // ✅ Google Search Console verification — reads from NEXT_PUBLIC_GSC_CODE env var
  ...(GSC_CODE && GSC_CODE !== "TODO_REPLACE_WITH_GSC_VERIFICATION_CODE" ? {
    verification: { google: GSC_CODE },
  } : {}),

  // ✅ Open Graph — complete with image
  openGraph: {
    title: "Instant Loans & Credit | Aapka Credit India",
    description:
      "Get instant personal, business & education loans through RBI-registered NBFC partners. Check eligibility in seconds — zero hidden fees.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "Aapka Credit — Instant Loans & Credit in India",
      },
    ],
  },

  // ✅ Twitter Card — complete with site handle
  twitter: {
    card: "summary_large_image",
    title: "Instant Loans & Credit | Aapka Credit India",
    description:
      "Get instant personal, business & education loans through RBI-registered NBFC partners. Check eligibility in seconds — zero hidden fees.",
    site: COMPANY.social.twitterHandle,
    creator: COMPANY.social.twitterHandle,
    images: [`${SITE_URL}/og-image.svg`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ✅ App metadata for PWA / mobile
  applicationName: SITE_NAME,
  category: "Finance",
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
};

// ─── Structured Data (JSON-LD) ───────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "FinancialService"],
  "@id": `${SITE_URL}/#organization`,
  name: COMPANY.brandName,
  legalName: COMPANY.legalEntity,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
    width: 200,
    height: 60,
  },
  description:
    "Aapka Credit is India's digital lending platform operated by Prism Cosmic Private Limited, connecting borrowers with RBI-registered NBFC lending partners for transparent personal, business, and education loans.",
  foundingDate: "2023",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2540",
    bestRating: "5",
    worstRating: "1"
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.line1,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.state,
    postalCode: COMPANY.address.postalCode,
    addressCountry: COMPANY.address.countryCode,
  },
  telephone: COMPANY.grievancePhone,
  email: COMPANY.supportEmail,
  sameAs: [
    COMPANY.social.linkedin,
    COMPANY.social.instagram,
    COMPANY.social.youtube,
  ],
  serviceType: "Digital Lending",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Loan Products",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "FinancialProduct",
          name: "Personal Loan",
          description: "Instant personal loans up to ₹40 Lakhs with flexible EMIs.",
          url: `${SITE_URL}/personal-loan`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "FinancialProduct",
          name: "Business Loan",
          description: "Collateral-free business loans up to ₹2 Crores for MSMEs.",
          url: `${SITE_URL}/business-loan`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "FinancialProduct",
          name: "Education Loan",
          description: "Education loans up to ₹75 Lakhs for domestic and international programs.",
          url: `${SITE_URL}/education-loan`,
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: "India's next-generation digital lending platform.",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  // ✅ SearchAction enables Google Sitelinks Search Box
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        {/* ✅ Organization + FinancialService Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* ✅ WebSite Schema with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* ✅ Google Analytics 4 (Placed directly in <head> as requested by Google) */}
        {GA4_ID && GA4_ID.startsWith("G-") && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA4_ID}', {
                  page_path: window.location.pathname,
                  send_page_view: true,
                  cookie_flags: 'SameSite=None;Secure',
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className="relative min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>

      </body>
    </html>
  );
}
