import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The fastest way to trade Solana memecoins | MoonGate",
  description: "Trade Solana memecoins like $Jenner, $Mother, $Bonk and $Wif using your Ethereum wallet or with one click google sign in to Solana.",
  keywords: ["Solana memecoins", "ethereum wif", "ethereum bonk", "Ethereum jenner", "jenner memecoin"],
  openGraph: {
    images: [
      {
        url: "/moongate-banner.png",
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
        url: "/moongate-banner.png",
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
        <meta property="og:image" content={"/moongate-banner.png"} />
        <meta name="twitter:image" content={"/moongate-banner.png"} />


      </Head>
    </html>
  );
}
