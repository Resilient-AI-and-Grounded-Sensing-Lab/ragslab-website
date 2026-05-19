import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { assetPath } from "@/lib/assets";
import { siteConfig, SocialIconName } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.title} logo`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};

const hostGrotesk = localFont({
  src: "../public/fonts/host-grotesk.ttf",
  variable: "--font-host",
  display: "swap"
});

const lora = localFont({
  src: "../public/fonts/lora.ttf",
  variable: "--font-lora",
  display: "swap"
});

function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "github") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19a2.65 2.65 0 0 0-1.11-1.46c-.91-.62.07-.61.07-.61a2.1 2.1 0 0 1 1.53 1.03 2.13 2.13 0 0 0 2.91.83 2.14 2.14 0 0 1 .64-1.34c-2.22-.25-4.56-1.11-4.56-4.94a3.86 3.86 0 0 1 1.03-2.68 3.59 3.59 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.47 9.47 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.64a3.85 3.85 0 0 1 1.03 2.68c0 3.84-2.34 4.69-4.57 4.94a2.4 2.4 0 0 1 .68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6.94 8.75H3.56V20h3.38V8.75ZM7.16 5.28A1.95 1.95 0 1 0 3.25 5.3a1.95 1.95 0 0 0 3.91-.02ZM20.75 13.55c0-3.02-1.61-4.43-3.77-4.43a3.25 3.25 0 0 0-2.95 1.62h-.05V8.75h-3.24V20h3.38v-5.56c0-1.47.28-2.88 2.09-2.88 1.78 0 1.8 1.67 1.8 2.97V20h3.38l-.64-6.45Z" />
      </svg>
    );
  }

  if (name === "x-twitter") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M13.8 10.47 21.03 2h-1.71l-6.28 7.35L8.03 2H2.25l7.58 11.12L2.25 22h1.71l6.63-7.77L15.88 22h5.78l-7.86-11.53Zm-2.35 2.75-.77-1.1L4.57 3.3h2.64l4.94 7.12.77 1.1 6.4 9.24h-2.64l-5.23-7.54Z" />
      </svg>
    );
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hostGrotesk.variable} ${lora.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="brand-mark" href="/" aria-label="RAGS Lab home">
              <img src={assetPath("/brand/logo-no-text.svg")} alt="" />
              <span>{siteConfig.name}</span>
            </Link>
            <nav aria-label="Primary navigation">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <Link className="footer-mark" href="/" aria-label="RAGS Lab home">
            <img src={assetPath("/brand/logo-no-text.svg")} alt="" />
          </Link>
          <nav aria-label="Social links">
            {siteConfig.socials.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                <SocialIcon name={social.icon} />
                <span>{social.label}</span>
              </a>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
