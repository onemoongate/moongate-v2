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

import { useEffect, useMemo, useState } from "react";
export default function App() {
    // call   useWalletModal().setVisible(true) when page renders to show the wallet modal, this is a hook so it can only be called in a functional component
    const { connected, connecting, disconnecting } = useWallet();
    const { setVisible } = useWalletModal();
    const [toggle, setToggle] = useState(false)
    useEffect(() => {
        if (connected || connecting) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    }, [connected, connecting, disconnecting])
    useEffect(() => {

        // Listen for any messages sent to the page
        window.addEventListener("message", (event) => {
            // Ensure the message is safe to forward if needed (e.g., validate origin)
            const message = event.data;

            // Forward the message to the parent page
            if (window.parent) {
                // check if parent page contains raydium.io
                if (window.parent.location.href.includes("raydium.io")) {
                    window.parent.postMessage(message, "*");
                    // ensure it's not spamming the parent page
                }
            }
        });

    }, [])

    /*   useEffect(() => {
          const myIframe = document.getElementById("myiframe");
  
          if (myIframe) {
  
              if (toggle) {
                  myIframe.style.display = "none"
              }
              else {
                  myIframe.style.display = "block"
              }
          }
      }, [toggle]) */
    return (
        <main className="flex justify-center py-10 space-x-8">
            <WalletMultiButton />
            {/*      <button className="bg-blue-800 px-6 py-2 rounded-md font-semibold" onClick={() => {
                setToggle(!toggle)



            }}>{toggle ? "Show Memecoins" : "Hide Memecoins"}</button> */}


        </main>
    );
}
