import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The fastest way to trade on Solana | MoonGate",
  description: "Use Solana in just one click using MoonGate",
  keywords: ["Solana memecoins", "ethereum wif", "ethereum bonk", "Ethereum jenner", "jenner memecoin"],
  openGraph: {
    images: [
      {
        url: "https://web.moongate.one/moongate-banner.png",
        width: 1200,
        height: 630,
        alt: "moongate logo showing the best way to trade memecoins on solana, the image shows pictures of famous Solana memecoins wrapped around the moongate logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "https://web.moongate.one/moongate-banner.png",
        width: 1200,
        height: 600,
        alt: "moongate logo showing the best way to trade memecoins on solana, the image shows pictures of famous Solana memecoins wrapped around the moongate logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <body className={inter.className}>{children}</body>
        <meta property="og:title" content={metadata?.openGraph?.title?.toString()} />
        <meta property="og:description" content={metadata?.openGraph?.description} />
        <meta property="og:url" content={metadata?.openGraph?.url?.toString()} />
        <meta property="og:image" content={"https://web.moongate.one/moongate-banner.png"} />
        <meta name="twitter:image" content={"https://web.moongate.one/moongate-banner.png"} />


      </Head>
      <body className={inter.className}>{children}</body>

    </html>
  );
}
