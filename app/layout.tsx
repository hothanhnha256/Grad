import type { Metadata, Viewport } from "next";
import { Dancing_Script, Mynerve, Noto_Serif, Nunito } from "next/font/google";
import { EVENT } from "@/lib/event";
import { OG_IMAGE } from "@/lib/meta";
import "./globals.css";

const nunito = Nunito({ subsets: ["vietnamese", "latin"], weight: ["500", "700", "800", "900"], variable: "--font-nunito", display: "swap" });
const serif = Noto_Serif({ subsets: ["vietnamese", "latin"], weight: ["400", "600"], style: ["normal", "italic"], variable: "--font-noto-serif", display: "swap" });
const dancing = Dancing_Script({ subsets: ["vietnamese", "latin"], weight: ["600", "700"], variable: "--font-dancing", display: "swap" });
const hand = Mynerve({ subsets: ["vietnamese", "latin"], weight: "400", variable: "--font-mynerve", display: "swap" });

function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: `Thiệp mời tốt nghiệp · ${EVENT.name}`,
  description: `${EVENT.dateLabel}, ${EVENT.timeLabel} tại ${EVENT.venue}. Nhã rất mong được gặp bạn!`,
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
  openGraph: { type: "website", locale: "vi_VN", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#142a66", width: "device-width", initialScale: 1 };

// Runs before paint.
// - `js`: show the envelope gate (CSS keeps it hidden otherwise).
// - `opened`: guest already opened the card in this tab → skip the gate.
// - failsafe: if React never hydrates (blocked/old browser), drop the gate and
//   un-hide scroll reveals after 6s so the guest is never stuck.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('invite-opened'))d.classList.add('opened')}catch(e){}setTimeout(function(){if(!window.__inviteReady){d.classList.add('opened','boot-failed')}},6000)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${nunito.variable} ${serif.variable} ${dancing.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-round antialiased">{children}</body>
    </html>
  );
}
