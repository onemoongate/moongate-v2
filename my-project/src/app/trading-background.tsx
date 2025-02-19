'use client';

import React, { useEffect, useRef } from 'react';

const SpaceOrbitalBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Set canvas to full screen
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Create stars
        const stars: { x: number, y: number, size: number, opacity: number }[] = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2
            });
        }

        // Create orbital paths
        const orbits: {
            centerX: number,
            centerY: number,
            radius: number,
            color: string,
            speed: number,
            width: number,
            particles: { angle: number, size: number, opacity: number }[],
            rotation: number
        }[] = [];

        // Generate random orbital paths
        for (let i = 0; i < 5; i++) {
            const centerX = canvas.width * (0.3 + Math.random() * 0.4);
            const centerY = canvas.height * (0.3 + Math.random() * 0.4);
            const radius = Math.min(canvas.width, canvas.height) * (0.2 + Math.random() * 0.3);

            // Generate a color in purple/blue space theme
            const hue = 220 + Math.random() * 60; // Blue to purple
            const saturation = 70 + Math.random() * 30;
            const lightness = 50 + Math.random() * 20;
            const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;

            const speed = 0.0005 + Math.random() * 0.001;
            const width = 1 + Math.random() * 3;
            const rotation = Math.random() * Math.PI * 2;

            // Create particles along the orbit
            const particles = [];
            const particleCount = 20 + Math.floor(Math.random() * 30);

            for (let j = 0; j < particleCount; j++) {
                particles.push({
                    angle: (j / particleCount) * Math.PI * 2,
                    size: 1 + Math.random() * 2,
                    opacity: 0.3 + Math.random() * 0.7
                });
            }

            orbits.push({
                centerX,
                centerY,
                radius,
                color,
                speed,
                width,
                particles,
                rotation
            });
        }

        const render = () => {
            // Clear canvas
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw stars with twinkling effect
            stars.forEach(star => {
                const twinkle = Math.sin(time * 0.001 + star.x) * 0.2 + 0.8;
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw and update orbital paths
            orbits.forEach(orbit => {
                // Update orbit rotation
                orbit.rotation += orbit.speed;

                // Draw orbit path
                ctx.strokeStyle = orbit.color;
                ctx.lineWidth = orbit.width;
                ctx.beginPath();
                for (let i = 0; i <= 360; i++) {
                    const angle = (i / 360) * Math.PI * 2;
                    const x = orbit.centerX + Math.cos(angle) * orbit.radius;
                    const y = orbit.centerY + Math.sin(angle) * orbit.radius;

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();

                // Draw particles on orbit
                orbit.particles.forEach(particle => {
                    const angle = particle.angle + orbit.rotation;
                    const x = orbit.centerX + Math.cos(angle) * orbit.radius;
                    const y = orbit.centerY + Math.sin(angle) * orbit.radius;

                    const glowSize = particle.size * 5;

                    // Draw glow
                    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
                    gradient.addColorStop(0, orbit.color.replace('0.6', '0.8'));
                    gradient.addColorStop(1, orbit.color.replace('0.6', '0'));

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw particle
                    ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                    ctx.beginPath();
                    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            time++;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
            style={{ background: 'linear-gradient(to bottom, #000000, #050327)' }}
        />
    );
};

export default SpaceOrbitalBackground;