"use client";

import { motion } from "framer-motion";

// --- BRAND CONSTANTS ---
const TOKENS = {
    colors: {
        teal: '#00d4aa',
        tealDim: 'rgba(0, 212, 170, 0.2)',
        platinumLight: '#f8fafc',
        platinumMid: '#cbd5e1',
        platinumDark: '#64748b',
    }
};

interface LogoProps {
    size?: number;
    animated?: boolean;
    className?: string;
    startDelay?: number;
}

/**
 * PROOF MATRIX LOGO
 * Concept: A wireframe cube (verification matrix) containing a solid tetrahedron (proof core).
 * Represents: Raw data entering a framework and emerging as verified immutable truth.
 */
export default function FormalBridgeLogo({
    size = 64,
    animated = true,
    className = "",
    startDelay = 0
}: LogoProps) {
    // ISOMETRIC GEOMETRY CALCULATIONS
    const R = 32;
    const cx = 50;
    const cy = 52;

    // Helper: Isometric projection (30 degrees)
    const iso = (x: number, y: number, z: number) => {
        const angle = Math.PI / 6; // 30 deg
        return {
            x: cx + (x - y) * Math.cos(angle),
            y: cy + (x + y) * Math.sin(angle) - z
        };
    };

    // Vertices for a Cube centered at 0,0,0
    // We construct the visual appearance of a cube standing on its corner
    // but simplified to standard isometric hexagon silhouette for cleanliness.
    const v = {
        // Center
        c: { x: cx, y: cy },
        // Outer Hexagon Points
        top: { x: cx, y: cy - R },
        btm: { x: cx, y: cy + R },
        tr: { x: cx + R * 0.866, y: cy - R * 0.5 },
        br: { x: cx + R * 0.866, y: cy + R * 0.5 },
        bl: { x: cx - R * 0.866, y: cy + R * 0.5 },
        tl: { x: cx - R * 0.866, y: cy - R * 0.5 },
    };

    // TETRAHEDRON (Solid Proof Core)
    const tr = R * 0.45;
    const tetra = {
        peak: { x: cx, y: cy - tr },
        left: { x: cx - tr * 0.866, y: cy + tr * 0.5 },
        right: { x: cx + tr * 0.866, y: cy + tr * 0.5 },
    };

    // ANIMATION VARIANTS
    const drawLine = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 0.8,
            transition: { delay: startDelay + i * 0.1, duration: 0.8, ease: "circOut" as const }
        })
    };

    const tetraAnim = {
        hidden: { scale: 0, opacity: 0, rotate: -10 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: { delay: startDelay + 1.2, type: "spring" as const, stiffness: 100, damping: 12 }
        }
    };

    return (
        <motion.div className={`relative ${className}`} style={{ width: size, height: size }}>
            <motion.svg
                width="100%" height="100%" viewBox="0 0 100 100" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
                initial={animated ? "hidden" : "visible"}
                animate="visible"
            >
                <defs>
                    <filter id="glow-teal-sm" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feFlood floodColor={TOKENS.colors.teal} floodOpacity="0.5" result="color" />
                        <feComposite in="color" in2="blur" operator="in" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <linearGradient id="plat-shadow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                </defs>

                {/* --- WIREFRAME CUBE --- */}
                {/* Back Lines */}
                <motion.g stroke={TOKENS.colors.teal} strokeWidth="1" strokeOpacity="0.3" fill="none">
                    <motion.path d={`M ${v.tl.x} ${v.tl.y} L ${v.c.x} ${v.c.y}`} variants={drawLine} custom={0} />
                    <motion.path d={`M ${v.tr.x} ${v.tr.y} L ${v.c.x} ${v.c.y}`} variants={drawLine} custom={1} />
                    <motion.path d={`M ${v.btm.x} ${v.btm.y} L ${v.c.x} ${v.c.y}`} variants={drawLine} custom={2} />
                </motion.g>

                {/* Front Hexagon Outline (Brighter + Glow) */}
                <motion.g
                    stroke={TOKENS.colors.teal}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={animated ? "url(#glow-teal-sm)" : undefined}
                >
                    <motion.path
                        d={`M ${v.top.x} ${v.top.y} L ${v.tr.x} ${v.tr.y} L ${v.br.x} ${v.br.y} L ${v.btm.x} ${v.btm.y} L ${v.bl.x} ${v.bl.y} L ${v.tl.x} ${v.tl.y} Z`}
                        variants={drawLine} custom={3} fill="none"
                    />
                    <motion.path d={`M ${v.c.x} ${v.c.y} L ${v.top.x} ${v.top.y}`} variants={drawLine} custom={4} />
                    <motion.path d={`M ${v.c.x} ${v.c.y} L ${v.br.x} ${v.br.y}`} variants={drawLine} custom={5} />
                    <motion.path d={`M ${v.c.x} ${v.c.y} L ${v.bl.x} ${v.bl.y}`} variants={drawLine} custom={6} />
                </motion.g>

                {/* Vertex Nodes */}
                {[v.top, v.tr, v.br, v.btm, v.bl, v.tl, v.c].map((pt, i) => (
                    <motion.circle
                        key={i} cx={pt.x} cy={pt.y} r={1.5} fill="white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: startDelay + 0.8 + i * 0.05 }}
                    />
                ))}

                {/* --- TETRAHEDRON --- */}
                <motion.g variants={tetraAnim} style={{ transformOrigin: '50% 50%' }}>
                    {/* Faces with distinct lighting */}
                    <path d={`M ${cx} ${cy - tr} L ${cx - tr * 0.7} ${cy + tr * 0.4} L ${cx} ${cy + tr * 0.6} Z`} fill="#cbd5e1" />
                    <path d={`M ${cx} ${cy - tr} L ${cx + tr * 0.7} ${cy + tr * 0.4} L ${cx} ${cy + tr * 0.6} Z`} fill="#64748b" />
                    {/* Highlight edge */}
                    <path d={`M ${cx} ${cy - tr} L ${cx} ${cy + tr * 0.6}`} stroke="white" strokeWidth="0.5" opacity="0.6" />
                </motion.g>

                {/* Pulse Interaction */}
                {animated && (
                    <motion.circle
                        cx={cx} cy={cy} r={R * 1.2}
                        stroke={TOKENS.colors.teal} strokeWidth="1" fill="none"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 0 }}
                        transition={{ delay: startDelay + 1.8, duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    />
                )}
            </motion.svg>
        </motion.div>
    );
}

// --- STATIC EXPORT FOR PDF/FOOTER (Optimized) ---
export function StaticLogo({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 18 L79 34 L79 66 L50 82 L21 66 L21 34 Z" stroke="#00d4aa" strokeWidth="2" fill="none" />
            <path d="M50 50 L50 18 M50 50 L79 66 M50 50 L21 66" stroke="#00d4aa" strokeWidth="2" opacity="0.7" />
            <path d="M50 35 L36 58 L50 65 Z" fill="#cbd5e1" />
            <path d="M50 35 L64 58 L50 65 Z" fill="#64748b" />
        </svg>
    );
}

// --- SVG STRING FOR PDF GENERATION ---
// Matched to the refined design
export const logoSvgString = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 18 L79 34 L79 66 L50 82 L21 66 L21 34 Z" stroke="#00d4aa" stroke-width="2" fill="none"/>
  <path d="M50 50 L50 18 M50 50 L79 66 M50 50 L21 66" stroke="#00d4aa" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M50 35 L36 58 L50 65 Z" fill="#cbd5e1"/>
  <path d="M50 35 L64 58 L50 65 Z" fill="#64748b"/>
</svg>`;
