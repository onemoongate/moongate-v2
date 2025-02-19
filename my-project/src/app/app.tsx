'use client';

import { Rocket, Zap, Coins } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';
import SignInButtons from './sign';


interface Orbit {
    radius: number;
    speed: number;
    phase: number;
}

interface OrbitingCoin {
    orbit: Orbit;
    imageName: string;
    size: number;
    angle: number;
    priceChange: number;
    priceUpdateCounter: number;

    update(): void;
    draw(ctx: CanvasRenderingContext2D, images: Map<string, HTMLImageElement>, centerX: number, centerY: number): void;
}


class CoinParticle implements OrbitingCoin {
    orbit: Orbit;
    imageName: string;
    size: number;
    angle: number;
    priceChange: number;
    priceUpdateCounter: number;

    constructor(orbit: Orbit, imageName: string) {
        this.orbit = orbit;
        this.imageName = imageName;
        this.size = 40;
        this.angle = Math.random() * Math.PI * 2;
        this.priceChange = Math.random() * 20 - 10;
        this.priceUpdateCounter = 0;
    }

    update(): void {
        this.angle += this.orbit.speed;
        if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;

        this.priceUpdateCounter++;
        if (this.priceUpdateCounter > 180) {
            this.priceChange = Math.random() * 20 - 10;
            this.priceUpdateCounter = 0;
        }
    }

    draw(ctx: CanvasRenderingContext2D, images: Map<string, HTMLImageElement>, centerX: number, centerY: number): void {
        // Calculate position and round to nearest pixel to avoid blurring
        const dpr = window.devicePixelRatio || 1;
        const roundToPixel = (value: number): number => Math.round(value * dpr) / dpr;

        const x = roundToPixel(centerX + Math.cos(this.angle) * this.orbit.radius);
        const y = roundToPixel(centerY + Math.sin(this.angle) * this.orbit.radius);

        const img = images.get(this.imageName);
        if (!img) return;

        // Draw orbit path
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 - (this.orbit.radius / 2000)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw coin with improved clarity
        const halfSize = roundToPixel(this.size / 2);
        const drawX = roundToPixel(x - halfSize);
        const drawY = roundToPixel(y - halfSize);
        const drawSize = roundToPixel(this.size);

        ctx.save();
        // For coin images, we maintain image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.beginPath();
        ctx.arc(x, y, halfSize, 0, Math.PI * 2);
        ctx.clip();

        // Use integer positions for image rendering
        ctx.drawImage(
            img,
            drawX,
            drawY,
            drawSize,
            drawSize
        );
        ctx.restore();

        // Draw pixel-perfect crisp text
        ctx.save();
        const isPositive = this.priceChange >= 0;
        const color = isPositive ? '#22c55e' : '#ef4444';
        const textY = roundToPixel(y + this.size / 2 + 20);

        // Disable image smoothing temporarily for text
        ctx.imageSmoothingEnabled = false;

        // Draw text background (no shadow, just solid black)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Use whole pixel values for font size to avoid blurry text
        const fontSize = 16;
        ctx.font = `bold ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;

        // Draw solid outline/background
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(
            `${isPositive ? '+' : ''}${this.priceChange.toFixed(1)}%`,
            x,
            textY
        );

        // Draw the main text (no blur, no shadow)
        ctx.fillStyle = color;
        ctx.fillText(
            `${isPositive ? '+' : ''}${this.priceChange.toFixed(1)}%`,
            x,
            textY
        );

        // Restore image smoothing setting
        ctx.imageSmoothingEnabled = true;
        ctx.restore();
    }
}

interface BackgroundOrbit {
    radius: number;
    speed: number;
    trailLength: number;
    points: { x: number; y: number; alpha: number }[];
}

const TradingBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
    const coinsRef = useRef<OrbitingCoin[]>([]);
    const backgroundOrbitsRef = useRef<BackgroundOrbit[]>([]);
    const dprRef = useRef<number>(1);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set initial DPR value
        dprRef.current = window.devicePixelRatio || 1;

        const setCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            dprRef.current = dpr;

            // Set the display size (CSS pixels)
            canvas.style.width = '100%';
            canvas.style.height = '100%';

            const rect = canvas.getBoundingClientRect();

            // Set actual size in memory (scaled to account for extra pixel density)
            const width = Math.floor(rect.width * dpr);
            const height = Math.floor(rect.height * dpr);
            canvas.width = width;
            canvas.height = height;

            // Scale all drawing operations by the dpr
            ctx.scale(dpr, dpr);
        };

        setCanvasSize();

        // Re-initialize on resize
        const handleResize = () => {
            // Reset the context to prevent scaling issues on resize
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            setCanvasSize();
        };

        window.addEventListener('resize', handleResize);

        const imageNames = ['bonk.jpg', 'gigachad.png', 'goat.jpg', 'mew.png', 'retardio.webp', 'wif.jpeg'];

        const loadImages = async () => {
            const imageLoadPromises = imageNames.map(name => {
                return new Promise<void>((resolve, reject) => {
                    const img = document.createElement('img') as HTMLImageElement;
                    img.onload = () => {
                        imagesRef.current.set(name, img);
                        resolve();
                    };
                    img.onerror = () => reject();
                    img.src = `/memes/${name}`;
                });
            });

            try {
                await Promise.all(imageLoadPromises);

                const orbits: Orbit[] = [
                    { radius: 200, speed: 0.002, phase: 0 },
                    { radius: 300, speed: 0.001, phase: Math.PI / 3 },
                    { radius: 400, speed: 0.0015, phase: Math.PI / 2 }
                ];

                coinsRef.current = imageNames.map((name, index) => {
                    const orbit = orbits[index % orbits.length];
                    return new CoinParticle(orbit, name);
                });
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        let animationFrameId: number;

        // Initialize background orbits
        const initBackgroundOrbits = () => {
            const orbits: BackgroundOrbit[] = [];
            const numOrbits = 5;

            for (let i = 0; i < numOrbits; i++) {
                orbits.push({
                    radius: 300 + i * 150, // Increasing radii
                    speed: 0.0003 + (Math.random() * 0.0002), // Slightly different speeds
                    trailLength: 50, // Number of points in the trail
                    points: []
                });
            }

            // Initialize points for each orbit
            orbits.forEach(orbit => {
                const angleStep = (Math.PI * 2) / orbit.trailLength;
                for (let i = 0; i < orbit.trailLength; i++) {
                    const angle = i * angleStep;
                    orbit.points.push({
                        x: Math.cos(angle) * orbit.radius,
                        y: Math.sin(angle) * orbit.radius,
                        alpha: 1 - (i / orbit.trailLength)
                    });
                }
            });

            backgroundOrbitsRef.current = orbits;
        };

        initBackgroundOrbits();

        const animate = () => {
            // Account for possible DPR changes (e.g., when moving between monitors)
            const currentDpr = window.devicePixelRatio || 1;
            if (currentDpr !== dprRef.current) {
                handleResize();
            }

            // Get logical canvas dimensions (not the physical pixel dimensions)
            const rect = canvas.getBoundingClientRect();
            const canvasWidth = rect.width;
            const canvasHeight = rect.height;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2;

            // Draw background orbits
            backgroundOrbitsRef.current.forEach(orbit => {
                // Update points
                orbit.points.forEach((point, index) => {
                    const angle = Math.atan2(point.y, point.x) + orbit.speed;
                    point.x = Math.cos(angle) * orbit.radius;
                    point.y = Math.sin(angle) * orbit.radius;
                    point.alpha = 1 - (index / orbit.trailLength);
                });

                // Draw orbit trail
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(147, 51, 234, 0.05)';
                ctx.lineWidth = 1;
                ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
                ctx.stroke();

                // Draw points
                orbit.points.forEach(point => {
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(147, 51, 234, ${point.alpha * 0.3})`;
                    ctx.arc(centerX + point.x, centerY + point.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            // Add central glow
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400);
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
            gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            coinsRef.current.forEach(coin => {
                coin.update();
                coin.draw(ctx, imagesRef.current, centerX, centerY);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        loadImages().then(() => {
            animate();
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [mounted]);

    return <canvas ref={canvasRef} className="absolute inset-0 bg-black blur-xs" />;
};

const AnimatedText = ({ children, delay = '0' }: { children: React.ReactNode; delay?: string }) => (
    <div className={`animate-fade-in opacity-0 [animation-delay:${delay}ms]`}>
        {children}
    </div>
);

export default function App() {
    const { connected, connecting, disconnecting, select } = useWallet();

    const google = "Sign in with Google" as WalletName
    const apple = "Sign in with Apple" as WalletName
    const ethereum = "Sign in with Ethereum" as WalletName

    /* const google = select(name) */
    /*     useEffect(() => {
            if (connected || connecting) {
                setVisible(false);
            } else {
                setVisible(true);
            }
        }, [connected, connecting, disconnecting, setVisible]); */

    useEffect(() => {
        // Create and append styles after component mounts (client-side only)
        const style = document.createElement('style');
        style.textContent = `
              @keyframes fade-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes gradient-xy {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(10px, 10px); }
                50% { transform: translate(0, 20px); }
                75% { transform: translate(-10px, 10px); }
              }
              .animate-fade-in { animation: fade-in 1s forwards ease-out; }
              .animate-gradient-xy { animation: gradient-xy 15s infinite linear; }
            `;
        document.head.appendChild(style);

        // Cleanup function to remove the style when component unmounts
        return () => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, []);
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (window.parent && window.parent.location.href.includes("raydium.io")) {
                window.parent.postMessage(message, "*");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <div className="min-h-screen relative bg-black text-white overflow-hidden">
            <TradingBackground />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-gray-900 opacity-90" />

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center bg-black bg-opacity-30">
                <div className='border-1 border-white rounded-lg p-12'>
                    <AnimatedText>
                        <div className="relative">

                            <div className="absolute -inset-1  blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
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
                        <p className="text-2xl mb-8 text-gray-300 max-w-2xl font-bold">
                            Trade memecoins in just a single click
                        </p>
                    </AnimatedText>
                    <AnimatedText delay="200">
                        <p className="mb-4 text-xl text-gray-300 max-w-2xl">
                            Sign in to Continue
                        </p>
                    </AnimatedText>
                    <AnimatedText delay="400">
                        {/* <WalletMultiButton className="!bg-gradient-to-r from-purple-500 !to-pink-500 hover:from-purple-600 hover:to-pink-600 !border-0 !px-8 !py-4 !rounded-xl !font-bold !text-lg shadow-lg hover:shadow-xl transition-all duration-300" /> */}
                        <SignInButtons />


                    </AnimatedText>
                </div>
                {/*   <AnimatedText delay="600">
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl">
                        <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-purple-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <Coins className="w-8 h-8 text-pink-400" />

                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-purple-300">Add funds</h3>
                            <p className="text-gray-400">Add funds from Coinbase, Binance or using your credit card</p>
                        </div>
                        <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-pink-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <Zap className="w-8 h-8 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-pink-300">Zero Fees</h3>
                            <p className="text-gray-400">Trade with no platform fees</p>
                        </div>
                        <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-lg border border-purple-500 border-opacity-20 hover:border-opacity-40 transition-all duration-300">
                            <div className="flex justify-center mb-4">
                                <Rocket className="w-8 h-8 text-purple-400" />

                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-purple-300">Early Access</h3>
                            <p className="text-gray-400">Get in early on trending tokens</p>
                        </div>
                    </div>
                </AnimatedText> */}
            </main>
        </div>
    );
}

