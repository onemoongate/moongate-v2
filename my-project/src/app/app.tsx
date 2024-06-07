"use client";
import Image from "next/image";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
    useWalletModal,
    WalletModal,

} from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';

import { useEffect, useMemo } from "react";
export default function App() {
    // call   useWalletModal().setVisible(true) when page renders to show the wallet modal, this is a hook so it can only be called in a functional component
    const { connected, connecting, disconnecting } = useWallet();
    const { setVisible } = useWalletModal();
    useEffect(() => {
        if (connected || connecting) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    }, [connected, connecting, disconnecting])
    return (
        <main className="flex justify-center py-10">
            <WalletMultiButton />

        </main>
    );
}
