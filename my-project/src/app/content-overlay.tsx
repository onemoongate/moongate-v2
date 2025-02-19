// ContentOverlay.tsx
'use client';

import { Wallet, Rocket, Coins } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

interface AnimatedTextProps {
    children: React.ReactNode;
    delay?: string;
}

const AnimatedText = ({ children, delay = '0' }: AnimatedTextProps) => (
    <div className={`animate-fade-in opacity-0 [animation-delay:${delay}ms]`}>
        {children}
    </div>
);

const ContentOverlay = () => {
    const { connected, connecting, disconnecting } = useWallet();
    const { setVisible } = useWalletModal();

    useEffect(() => {
        if (connected || connecting) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }, [connected, connecting, disconnecting, setVisible]);

    return (
        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-hidden">
            {/* Space background with orbital animation */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-black">
                {/* Stars */}
                <div className="stars"></div>

                {/* Orbital path */}
                <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[800px] border border-purple-500 opacity-20 rounded-full animate-spin-slow"></div>

                    {/* Orbiting planet */}
                    <div className="absolute w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50 animate-orbit"></div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-gray-900 opacity-30" />

            <AnimatedText>
                <div className="relative">
                    <div className="absolute -inset-1 brounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                    <Image
                        src="/mg.png"
                        alt="Moongate Logo"
                        width={300}
                        height={100}
                        className="mx-auto"
                    />
                </div>
            </AnimatedText>

            <AnimatedText delay="200">
                <p className="text-xl mb-12 text-gray-300 max-w-2xl">
                    Your gateway to the next generation of meme tokens on Solana
                </p>
            </AnimatedText>

            <AnimatedText delay="400">
                <div className="transform hover:scale-105 transition-transform duration-300">
                    <WalletMultiButton className="!bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 !border-0 !px-8 !py-4 !rounded-xl !font-bold !text-lg shadow-lg hover:shadow-xl transition-all duration-300" />
                </div>
            </AnimatedText>

            <AnimatedText delay="600">
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl">
                    <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-blue-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <Wallet className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-300">Add Funds</h3>
                        <p className="text-gray-400">Connect and fuel your cosmic journey</p>
                    </div>
                    <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-pink-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <Rocket className="w-8 h-8 text-pink-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-pink-300">APE</h3>
                        <p className="text-gray-400">Launch into trending memecoin rockets</p>
                    </div>
                    <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-green-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                        <div className="flex justify-center mb-4">
                            <Coins className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-green-300">Reap Rewards</h3>
                        <p className="text-gray-400">Harvest your interstellar gains</p>
                    </div>
                </div>
            </AnimatedText>

            {/* Add these styles to your global CSS or a styled component */}
            <style jsx>{`
                @keyframes orbit {
                    0% { transform: translateX(-400px) translateY(0) scale(0.8); }
                    25% { transform: translateX(0) translateY(-400px) scale(1); }
                    50% { transform: translateX(400px) translateY(0) scale(0.8); }
                    75% { transform: translateX(0) translateY(400px) scale(1); }
                    100% { transform: translateX(-400px) translateY(0) scale(0.8); }
                }
                
                .animate-orbit {
                    animation: orbit 60s linear infinite;
                }
                
                .animate-spin-slow {
                    animation: spin 120s linear infinite;
                }
                
                .stars {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    background-image: radial-gradient(2px 2px at 20px 30px, white, rgba(0, 0, 0, 0)),
                                    radial-gradient(2px 2px at 40px 70px, white, rgba(0, 0, 0, 0)),
                                    radial-gradient(2px 2px at 50px 160px, white, rgba(0, 0, 0, 0)),
                                    radial-gradient(2px 2px at 90px 40px, white, rgba(0, 0, 0, 0)),
                                    radial-gradient(2px 2px at 130px 80px, white, rgba(0, 0, 0, 0)),
                                    radial-gradient(2px 2px at 160px 120px, white, rgba(0, 0, 0, 0));
                    background-repeat: repeat;
                    background-size: 200px 200px;
                }
            `}</style>
        </main>
    );
};

export default ContentOverlay;