"use client";
import Image from "next/image";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';

import { MoongateWalletAdapter } from "@moongate/moongate-adapter"
import { useMemo } from "react";

export default function App() {
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
            new MoongateWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const walletToSign = useWallet().select(wallets[0].name);
    useWallet().connect();
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

        </main>
    );
}
