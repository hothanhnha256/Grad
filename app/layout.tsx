import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import { EVENT } from "@/lib/event";
import { OG_IMAGE } from "@/lib/meta";
import "./globals.css";

const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["vietnamese", "latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `Thiệp mời tốt nghiệp · ${EVENT.name}`,
  description: `${EVENT.dateLabel}, 12:00 tại ${EVENT.venue}. Rất mong được gặp bạn!`,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0b1d3f" };

// Runs before paint: enables the envelope only when JS works, and skips it
// if the guest already opened the card in this tab.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('invite-opened'))d.classList.add('opened')}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
