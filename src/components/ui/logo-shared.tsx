// --- logo-shared.ts ---
// Shared tokens, geometry, and definitions for the Proof Matrix logo system

export const TOKENS = {
    colors: {
        teal: '#00d4aa',
        tealGlow: 'rgba(0, 212, 170, 0.6)',
        tealDim: 'rgba(0, 212, 170, 0.2)',
        platBright: '#f0f0f0', // Front face
        platMid: '#c0c0c0',    // Right face
        platDark: '#888888',   // Left/Shadow face
    }
};

export interface LogoProps {
    size?: number;
    className?: string;
    startDelay?: number;
}

// --- GEOMETRY ---
// Center points based on 100x100 SVG viewBox
export const cx = 50;
export const cy = 50;
export const R = 35; // Cube Radius
export const tr = R * 0.45; // Tetrahedron Radius (45% scale)

// Pre-calculated Isometric Vertices (Standard Orientation)
const angle30 = Math.PI / 6;
const sin30 = Math.sin(angle30); // 0.5
const cos30 = Math.cos(angle30); // ~0.866

export const V = {
    c: { x: cx, y: cy },
    top: { x: cx, y: cy - R },
    btm: { x: cx, y: cy + R },
    tr: { x: cx + R * cos30, y: cy - R * sin30 },
    br: { x: cx + R * cos30, y: cy + R * sin30 },
    bl: { x: cx - R * cos30, y: cy + R * sin30 },
    tl: { x: cx - R * cos30, y: cy - R * sin30 },
};

// Tetrahedron vertices (Shifted up slightly as per spec)
const tShiftY = -5;
export const T = {
    apex: { x: cx, y: cy - tr + tShiftY },
    bl: { x: cx - tr * cos30, y: cy + tr * 0.5 + tShiftY },
    br: { x: cx + tr * cos30, y: cy + tr * 0.5 + tShiftY },
    back: { x: cx, y: cy + tr * 0.5 + tShiftY }
};

// SHARED SVG DEFINITIONS (Glows/Gradients)
export const SharedDefs = () => (
    <defs>
        <filter id="teal-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={TOKENS.colors.teal} floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="plat-metal-shine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TOKENS.colors.platBright} stopOpacity={0.8} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="100%" stopColor={TOKENS.colors.platBright} stopOpacity={0.8} />
        </linearGradient>
    </defs>
);
