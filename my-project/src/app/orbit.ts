// orbitAnimation.ts

export interface Orbit {
    radius: number;
    speed: number;
    phase: number;
}

export interface OrbitingCoin {
    orbit: Orbit;
    imageName: string;
    size: number;
    angle: number;
    priceChange: number;
    priceUpdateCounter: number;

    update(): void;
    draw(ctx: CanvasRenderingContext2D, images: Map<string, HTMLImageElement>, centerX: number, centerY: number, dpr: number): void;
}

export class CoinParticle implements OrbitingCoin {
    orbit: Orbit;
    imageName: string;
    size: number;
    angle: number;
    priceChange: number;
    priceUpdateCounter: number;

    constructor(orbit: Orbit, imageName: string) {
        this.orbit = orbit;
        this.imageName = imageName;
        this.size = 40; // Reduced base size for smaller logos
        this.angle = orbit.phase + (Math.random() * Math.PI * 2);
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

    draw(ctx: CanvasRenderingContext2D, images: Map<string, HTMLImageElement>, centerX: number, centerY: number, dpr: number): void {
        // Calculate position on orbit
        const x = centerX + Math.cos(this.angle) * this.orbit.radius;
        const y = centerY + Math.sin(this.angle) * this.orbit.radius;

        const img = images.get(this.imageName);
        if (!img) return;

        // Draw orbit path with consistent visibility
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.orbit.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1 * dpr; // Scale line width
        ctx.stroke();

        // Scale size based on DPR
        const scaledSize = this.size * dpr;

        // Draw coin centered on orbit - with max size limit to prevent oversized logos
        ctx.save();
        // Apply max size cap regardless of DPR to keep logos reasonable size
        const maxSize = 80;
        const finalSize = Math.min(scaledSize, maxSize * dpr);
        const halfSize = finalSize / 2;
        ctx.beginPath();
        ctx.arc(x, y, halfSize, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            img,
            x - halfSize,
            y - halfSize,
            finalSize,
            finalSize
        );
        ctx.restore();

        // Draw price change with improved clarity
        ctx.save();
        const isPositive = this.priceChange >= 0;
        const color = isPositive ? '#22c55e' : '#ef4444';

        // Draw text background for better readability
        const text = `${isPositive ? '+' : ''}${this.priceChange.toFixed(1)}%`;
        const fontSize = 16 * dpr; // Scale font size
        ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textAlign = 'center';

        // Add background glow without blur
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const padding = 6 * dpr; // Scale padding
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width + padding * 2;
        const textHeight = 24 * dpr; // Scale text height
        const textY = y + finalSize / 2 + 20 * dpr; // Scale vertical positioning

        ctx.fillRect(
            x - textWidth / 2,
            textY - textHeight / 2,
            textWidth,
            textHeight
        );

        // Draw sharp, clear text
        ctx.fillStyle = color;
        ctx.fillText(text, x, textY + dpr); // Slight adjustment for centering
        ctx.restore();
    }
}

export interface BackgroundOrbit {
    radius: number;
    speed: number;
    trailLength: number;
    points: { x: number; y: number; alpha: number }[];
}

export const createBackgroundOrbits = (numOrbits: number = 3): BackgroundOrbit[] => {
    const orbits: BackgroundOrbit[] = [];

    for (let i = 0; i < numOrbits; i++) {
        const orbit: BackgroundOrbit = {
            radius: 120 + i * 100, // Increased spacing between orbits
            speed: 0.0003 + (Math.random() * 0.0002),
            trailLength: 50,
            points: []
        };

        // Initialize points for the orbit
        const angleStep = (Math.PI * 2) / orbit.trailLength;
        for (let j = 0; j < orbit.trailLength; j++) {
            const angle = j * angleStep;
            orbit.points.push({
                x: Math.cos(angle) * orbit.radius,
                y: Math.sin(angle) * orbit.radius,
                alpha: 1 - (j / orbit.trailLength)
            });
        }

        orbits.push(orbit);
    }

    return orbits;
};

export const updateAndDrawBackgroundOrbits = (
    ctx: CanvasRenderingContext2D,
    orbits: BackgroundOrbit[],
    centerX: number,
    centerY: number,
    dpr: number
) => {
    orbits.forEach(orbit => {
        // Update points
        orbit.points.forEach((point, index) => {
            const angle = Math.atan2(point.y, point.x) + orbit.speed;
            point.x = Math.cos(angle) * orbit.radius;
            point.y = Math.sin(angle) * orbit.radius;
            point.alpha = 1 - (index / orbit.trailLength);
        });

        // Draw orbit trail
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1 * dpr; // Scale line width
        ctx.arc(centerX, centerY, orbit.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw points
        orbit.points.forEach(point => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha * 0.3})`;
            ctx.arc(
                centerX + point.x,
                centerY + point.y,
                2 * dpr, // Scale point size
                0,
                Math.PI * 2
            );
            ctx.fill();
        });
    });

    // Add central glow
    const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        400 * dpr // Scale glow radius
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const DEFAULT_ORBITS: Orbit[] = [
    { radius: 120, speed: 0.001, phase: 0 },
    { radius: 220, speed: 0.0006, phase: Math.PI / 2 },
    { radius: 320, speed: 0.0003, phase: Math.PI / 4 }
];

// New helper function to set up canvas for high DPI displays
export const setupHighDPICanvas = (canvas: HTMLCanvasElement): number => {
    // Get the device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    // Get the CSS dimensions
    const rect = canvas.getBoundingClientRect();

    // Set the canvas dimensions accounting for DPI
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the canvas back down with CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Get the context and scale all drawing operations
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.scale(dpr, dpr);
    }

    return dpr;
};

// Helper function to get the properly scaled canvas center
export const getScaledCanvasCenter = (canvas: HTMLCanvasElement, dpr: number): [number, number] => {
    return [
        canvas.width / (2 * dpr),
        canvas.height / (2 * dpr)
    ];
};

// Helper function to scale orbits for different screen sizes
export const getScaledOrbits = (baseOrbits: Orbit[], screenWidth: number, screenHeight: number): Orbit[] => {
    // Use the smaller dimension to calculate scale factor
    const minDimension = Math.min(screenWidth, screenHeight);
    const scaleFactor = minDimension / 1080; // Assuming 1080p as baseline

    return baseOrbits.map(orbit => ({
        ...orbit,
        radius: orbit.radius * scaleFactor
    }));
};