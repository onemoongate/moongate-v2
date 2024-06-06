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
import { useMemo } from "react";
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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <App />
        </main>
      </WalletModalProvider >

    </WalletProvider>
  );
}
