"use client";

import { motion } from "framer-motion";

// --- BRAND CONSTANTS ---
const TOKENS = {
    colors: {
        teal: '#00d4aa',
        tealGlow: 'rgba(0, 212, 170, 0.6)',
        platinum: '#e8e8e8',
        steel: '#94a3b8',
    }
};

// --- PROOF MATRIX LOGO: Wireframe Cube with Tetrahedron ---
interface LogoProps {
    size?: number;
    animated?: boolean;
    className?: string;
    startDelay?: number;
}

export default function FormalBridgeLogo({
    size = 64,
    animated = true,
    className = "",
    startDelay = 0
}: LogoProps) {
    // Isometric cube vertices (projected to 2D)
    const cubeSize = 35;
    const cx = 50; // center x
    const cy = 50; // center y
    const angle = Math.PI / 6; // 30 degrees for isometric

    // Helper to project 3D to 2D isometric
    const iso = (x: number, y: number, z: number) => ({
        x: cx + (x - y) * Math.cos(angle) * 0.8,
        y: cy + (x + y) * Math.sin(angle) * 0.5 - z * 0.7
    });

    // Cube vertices
    const v = {
        // Bottom face
        b1: iso(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2),
        b2: iso(cubeSize / 2, -cubeSize / 2, -cubeSize / 2),
        b3: iso(cubeSize / 2, cubeSize / 2, -cubeSize / 2),
        b4: iso(-cubeSize / 2, cubeSize / 2, -cubeSize / 2),
        // Top face
        t1: iso(-cubeSize / 2, -cubeSize / 2, cubeSize / 2),
        t2: iso(cubeSize / 2, -cubeSize / 2, cubeSize / 2),
        t3: iso(cubeSize / 2, cubeSize / 2, cubeSize / 2),
        t4: iso(-cubeSize / 2, cubeSize / 2, cubeSize / 2),
    };

    // Cube edges as path
    const cubeEdges = [
        // Bottom face
        `M ${v.b1.x} ${v.b1.y} L ${v.b2.x} ${v.b2.y}`,
        `M ${v.b2.x} ${v.b2.y} L ${v.b3.x} ${v.b3.y}`,
        `M ${v.b3.x} ${v.b3.y} L ${v.b4.x} ${v.b4.y}`,
        `M ${v.b4.x} ${v.b4.y} L ${v.b1.x} ${v.b1.y}`,
        // Top face
        `M ${v.t1.x} ${v.t1.y} L ${v.t2.x} ${v.t2.y}`,
        `M ${v.t2.x} ${v.t2.y} L ${v.t3.x} ${v.t3.y}`,
        `M ${v.t3.x} ${v.t3.y} L ${v.t4.x} ${v.t4.y}`,
        `M ${v.t4.x} ${v.t4.y} L ${v.t1.x} ${v.t1.y}`,
        // Vertical edges
        `M ${v.b1.x} ${v.b1.y} L ${v.t1.x} ${v.t1.y}`,
        `M ${v.b2.x} ${v.b2.y} L ${v.t2.x} ${v.t2.y}`,
        `M ${v.b3.x} ${v.b3.y} L ${v.t3.x} ${v.t3.y}`,
        `M ${v.b4.x} ${v.b4.y} L ${v.t4.x} ${v.t4.y}`,
    ];

    // Tetrahedron inside (smaller)
    const tetraScale = 0.45;
    const tCenter = { x: cx, y: cy - 2 };
    const tetraH = cubeSize * tetraScale;
    const tetraBase = cubeSize * tetraScale * 0.866; // sqrt(3)/2

    // Tetrahedron vertices in 3D then project
    const tetra = {
        apex: iso(0, 0, tetraH * 0.8),
        base1: iso(-tetraBase * 0.5, -tetraBase * 0.3, -tetraH * 0.3),
        base2: iso(tetraBase * 0.5, -tetraBase * 0.3, -tetraH * 0.3),
        base3: iso(0, tetraBase * 0.5, -tetraH * 0.3),
    };

    return (
        <motion.div
            className={`relative ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* Teal glow filter */}
                    <filter id="glow-cube" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Stronger glow for tetrahedron */}
                    <filter id="glow-tetra" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Platinum gradient for tetrahedron */}
                    <linearGradient id="platinum-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f0f0f0" />
                        <stop offset="50%" stopColor="#d4d4d4" />
                        <stop offset="100%" stopColor="#a0a0a0" />
                    </linearGradient>

                    {/* Animated dash for cube edges */}
                    <linearGradient id="teal-edge" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={TOKENS.colors.teal} stopOpacity="0.4" />
                        <stop offset="50%" stopColor={TOKENS.colors.teal} stopOpacity="1" />
                        <stop offset="100%" stopColor={TOKENS.colors.teal} stopOpacity="0.4" />
                    </linearGradient>
                </defs>

                {/* WIREFRAME CUBE */}
                <g filter="url(#glow-cube)">
                    {cubeEdges.map((d, i) => (
                        <motion.path
                            key={i}
                            d={d}
                            stroke={TOKENS.colors.teal}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                            initial={animated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.8 }}
                            animate={{ pathLength: 1, opacity: 0.8 }}
                            transition={{
                                delay: startDelay + (i * 0.05),
                                duration: 0.4,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                </g>

                {/* Corner nodes/vertices */}
                {[v.b1, v.b2, v.b3, v.b4, v.t1, v.t2, v.t3, v.t4].map((vertex, i) => (
                    <motion.circle
                        key={`node-${i}`}
                        cx={vertex.x}
                        cy={vertex.y}
                        r="2"
                        fill={TOKENS.colors.teal}
                        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            delay: startDelay + 0.6 + (i * 0.03),
                            type: "spring",
                            stiffness: 500,
                            damping: 20
                        }}
                    />
                ))}

                {/* TETRAHEDRON (Proof Symbol) */}
                <motion.g
                    filter="url(#glow-tetra)"
                    initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        delay: startDelay + 0.9,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                    }}
                >
                    {/* Tetrahedron faces - front face */}
                    <path
                        d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base1.x} ${tetra.base1.y} L ${tetra.base2.x} ${tetra.base2.y} Z`}
                        fill="url(#platinum-grad)"
                        opacity="0.9"
                    />
                    {/* Side face */}
                    <path
                        d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base2.x} ${tetra.base2.y} L ${tetra.base3.x} ${tetra.base3.y} Z`}
                        fill="#c0c0c0"
                        opacity="0.7"
                    />
                    {/* Other side face */}
                    <path
                        d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base3.x} ${tetra.base3.y} L ${tetra.base1.x} ${tetra.base1.y} Z`}
                        fill="#888888"
                        opacity="0.6"
                    />
                    {/* Bottom face (barely visible) */}
                    <path
                        d={`M ${tetra.base1.x} ${tetra.base1.y} L ${tetra.base2.x} ${tetra.base2.y} L ${tetra.base3.x} ${tetra.base3.y} Z`}
                        fill="#666666"
                        opacity="0.4"
                    />

                    {/* Tetrahedron edges for definition */}
                    {[
                        `M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base1.x} ${tetra.base1.y}`,
                        `M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base2.x} ${tetra.base2.y}`,
                        `M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base3.x} ${tetra.base3.y}`,
                        `M ${tetra.base1.x} ${tetra.base1.y} L ${tetra.base2.x} ${tetra.base2.y}`,
                        `M ${tetra.base2.x} ${tetra.base2.y} L ${tetra.base3.x} ${tetra.base3.y}`,
                        `M ${tetra.base3.x} ${tetra.base3.y} L ${tetra.base1.x} ${tetra.base1.y}`,
                    ].map((d, i) => (
                        <path
                            key={`edge-${i}`}
                            d={d}
                            stroke="white"
                            strokeWidth="0.5"
                            fill="none"
                            opacity="0.6"
                        />
                    ))}
                </motion.g>

                {/* Pulse effect on completion */}
                {animated && (
                    <motion.circle
                        cx={cx}
                        cy={cy}
                        r="15"
                        stroke={TOKENS.colors.teal}
                        fill="none"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{
                            delay: startDelay + 1.2,
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                        strokeWidth="2"
                    />
                )}
            </motion.svg>
        </motion.div>
    );
}

/**
 * Static version for contexts without animation (Footer, PDFs, etc)
 */
export function StaticLogo({ size = 24 }: { size?: number }) {
    // Simplified static version
    const cubeSize = 35;
    const cx = 50;
    const cy = 50;
    const angle = Math.PI / 6;

    const iso = (x: number, y: number, z: number) => ({
        x: cx + (x - y) * Math.cos(angle) * 0.8,
        y: cy + (x + y) * Math.sin(angle) * 0.5 - z * 0.7
    });

    const v = {
        b1: iso(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2),
        b2: iso(cubeSize / 2, -cubeSize / 2, -cubeSize / 2),
        b3: iso(cubeSize / 2, cubeSize / 2, -cubeSize / 2),
        b4: iso(-cubeSize / 2, cubeSize / 2, -cubeSize / 2),
        t1: iso(-cubeSize / 2, -cubeSize / 2, cubeSize / 2),
        t2: iso(cubeSize / 2, -cubeSize / 2, cubeSize / 2),
        t3: iso(cubeSize / 2, cubeSize / 2, cubeSize / 2),
        t4: iso(-cubeSize / 2, cubeSize / 2, cubeSize / 2),
    };

    const tetraScale = 0.45;
    const tetraH = cubeSize * tetraScale;
    const tetraBase = cubeSize * tetraScale * 0.866;

    const tetra = {
        apex: iso(0, 0, tetraH * 0.8),
        base1: iso(-tetraBase * 0.5, -tetraBase * 0.3, -tetraH * 0.3),
        base2: iso(tetraBase * 0.5, -tetraBase * 0.3, -tetraH * 0.3),
        base3: iso(0, tetraBase * 0.5, -tetraH * 0.3),
    };

    const cubeEdges = [
        `M ${v.b1.x} ${v.b1.y} L ${v.b2.x} ${v.b2.y}`,
        `M ${v.b2.x} ${v.b2.y} L ${v.b3.x} ${v.b3.y}`,
        `M ${v.b3.x} ${v.b3.y} L ${v.b4.x} ${v.b4.y}`,
        `M ${v.b4.x} ${v.b4.y} L ${v.b1.x} ${v.b1.y}`,
        `M ${v.t1.x} ${v.t1.y} L ${v.t2.x} ${v.t2.y}`,
        `M ${v.t2.x} ${v.t2.y} L ${v.t3.x} ${v.t3.y}`,
        `M ${v.t3.x} ${v.t3.y} L ${v.t4.x} ${v.t4.y}`,
        `M ${v.t4.x} ${v.t4.y} L ${v.t1.x} ${v.t1.y}`,
        `M ${v.b1.x} ${v.b1.y} L ${v.t1.x} ${v.t1.y}`,
        `M ${v.b2.x} ${v.b2.y} L ${v.t2.x} ${v.t2.y}`,
        `M ${v.b3.x} ${v.b3.y} L ${v.t3.x} ${v.t3.y}`,
        `M ${v.b4.x} ${v.b4.y} L ${v.t4.x} ${v.t4.y}`,
    ].join(' ');

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="static-platinum" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f0f0f0" />
                    <stop offset="50%" stopColor="#d4d4d4" />
                    <stop offset="100%" stopColor="#a0a0a0" />
                </linearGradient>
                <filter id="static-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Cube wireframe */}
            <g filter="url(#static-glow)">
                <path
                    d={cubeEdges}
                    stroke="#00d4aa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                />
            </g>

            {/* Tetrahedron */}
            <g>
                <path
                    d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base1.x} ${tetra.base1.y} L ${tetra.base2.x} ${tetra.base2.y} Z`}
                    fill="url(#static-platinum)"
                    opacity="0.9"
                />
                <path
                    d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base2.x} ${tetra.base2.y} L ${tetra.base3.x} ${tetra.base3.y} Z`}
                    fill="#c0c0c0"
                    opacity="0.7"
                />
                <path
                    d={`M ${tetra.apex.x} ${tetra.apex.y} L ${tetra.base3.x} ${tetra.base3.y} L ${tetra.base1.x} ${tetra.base1.y} Z`}
                    fill="#888888"
                    opacity="0.6"
                />
            </g>
        </svg>
    );
}

/**
 * SVG string for use in PDFs and other non-React contexts
 */
export const logoSvgString = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="platinum" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f0f0"/>
      <stop offset="50%" stop-color="#d4d4d4"/>
      <stop offset="100%" stop-color="#a0a0a0"/>
    </linearGradient>
  </defs>
  <g opacity="0.8">
    <path d="M 35.2 58.8 L 64.8 58.8" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 64.8 58.8 L 50 76.3" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 50 76.3 L 35.2 58.8" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 35.2 41.2 L 64.8 41.2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 64.8 41.2 L 50 23.7" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 50 23.7 L 35.2 41.2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 35.2 58.8 L 35.2 41.2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 64.8 58.8 L 64.8 41.2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M 50 76.3 L 50 23.7" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <path d="M 50 35 L 42 52 L 58 52 Z" fill="url(#platinum)" opacity="0.9"/>
  <path d="M 50 35 L 58 52 L 50 58 Z" fill="#c0c0c0" opacity="0.7"/>
  <path d="M 50 35 L 50 58 L 42 52 Z" fill="#888888" opacity="0.6"/>
</svg>`;
