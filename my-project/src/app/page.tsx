"use client";
import Image from "next/image";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  useWalletModal,
} from '@solana/wallet-adapter-react-ui';
import App from "./app";
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { registerMoonGateWallet } from "@moongate/moongate-adapter";
import { useEffect, useMemo } from "react";
require('@solana/wallet-adapter-react-ui/styles.css');
registerMoonGateWallet({ authMode: "Google" });
registerMoonGateWallet({ authMode: "Ethereum" });
export default function Home() {
  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      /*    new MoongateWalletAdapter({ authMode: "Google" }), */
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (

    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>

        <main className="">

          <App />
          <iframe id="myiframe" src="https://coinranking.com/coins/solana-meme" sandbox="allow-scripts allow-same-origin" className="w-full min-h-screen px-4 sm:px-20" />
        </main>
      </WalletModalProvider >

    </WalletProvider>
  );
}
