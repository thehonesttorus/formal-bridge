"use client";

import { motion } from "framer-motion";
import { TOKENS, LogoProps, V, T, SharedDefs, cx, cy, tr } from "./logo-shared";

/**
 * VERSION 1: "Sequential Build" (Canonical Approach)
 * The baseline professional reveal. Wireframe draws sequentially,
 * then solid tetrahedron materializes with spring physics.
 * 
 * Best for: Main website header, app loading screen.
 */
export default function FormalBridgeLogo({
    size = 80,
    className = "",
    startDelay = 0
}: LogoProps) {
    // Animation Variants
    const wireframeDraw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                delay: startDelay + i * 0.15,
                duration: 0.7,
                ease: "easeInOut" as const
            }
        })
    };

    const nodePop = {
        hidden: { scale: 0 },
        visible: (i: number) => ({
            scale: 1,
            transition: {
                delay: startDelay + 0.6 + i * 0.05,
                type: "spring" as const,
                stiffness: 300
            }
        })
    };

    const solidAppear = {
        hidden: { scale: 0.8, opacity: 0, y: 10 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                delay: startDelay + 1.4,
                type: "spring" as const,
                stiffness: 120,
                damping: 10,
                mass: 1.5
            }
        }
    };

    const shineSweep = {
        hidden: { x: "-100%", opacity: 0 },
        visible: {
            x: "200%",
            opacity: [0, 0.8, 0],
            transition: {
                delay: startDelay + 1.8,
                duration: 1.2,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate="visible"
                initial="hidden"
            >
                <SharedDefs />

                {/* --- WIREFRAME --- */}
                <motion.g
                    stroke={TOKENS.colors.teal}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    filter="url(#teal-bloom)"
                    strokeOpacity={0.8}
                >
                    {/* Back/Inner Lines (drawn first) */}
                    <motion.path d={`M ${V.tl.x} ${V.tl.y} L ${V.c.x} ${V.c.y}`} variants={wireframeDraw} custom={0} opacity={0.5} />
                    <motion.path d={`M ${V.tr.x} ${V.tr.y} L ${V.c.x} ${V.c.y}`} variants={wireframeDraw} custom={1} opacity={0.5} />
                    <motion.path d={`M ${V.btm.x} ${V.btm.y} L ${V.c.x} ${V.c.y}`} variants={wireframeDraw} custom={2} opacity={0.5} />
                    {/* Outer Hexagon */}
                    <motion.path
                        d={`M ${V.top.x} ${V.top.y} L ${V.tr.x} ${V.tr.y} L ${V.br.x} ${V.br.y} L ${V.btm.x} ${V.btm.y} L ${V.bl.x} ${V.bl.y} L ${V.tl.x} ${V.tl.y} Z`}
                        variants={wireframeDraw}
                        custom={3}
                    />
                    {/* Front spokes connecting to center */}
                    <motion.path d={`M ${V.c.x} ${V.c.y} L ${V.top.x} ${V.top.y}`} variants={wireframeDraw} custom={4} />
                    <motion.path d={`M ${V.c.x} ${V.c.y} L ${V.br.x} ${V.br.y}`} variants={wireframeDraw} custom={5} />
                    <motion.path d={`M ${V.c.x} ${V.c.y} L ${V.bl.x} ${V.bl.y}`} variants={wireframeDraw} custom={6} />
                </motion.g>

                {/* Nodes at Vertices */}
                {[V.top, V.tr, V.br, V.btm, V.bl, V.tl].map((pt, i) => (
                    <motion.circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={2}
                        fill={TOKENS.colors.teal}
                        variants={nodePop}
                        custom={i}
                    />
                ))}

                {/* --- SOLID TETRAHEDRON CORE --- */}
                <motion.g variants={solidAppear} style={{ originX: '50%', originY: '50%' }}>
                    {/* Clip for shine effect */}
                    <defs>
                        <clipPath id="tetra-clip">
                            <path d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} L ${T.bl.x} ${T.bl.y} Z`} />
                        </clipPath>
                    </defs>

                    {/* Faces with proper shading */}
                    {/* Right (Mid) Face */}
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} L ${T.back.x} ${T.back.y} Z`} fill={TOKENS.colors.platMid} />
                    {/* Left (Dark) Face */}
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.bl.x} ${T.bl.y} L ${T.back.x} ${T.back.y} Z`} fill={TOKENS.colors.platDark} />
                    {/* Front (Brightest) Face */}
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} L ${T.bl.x} ${T.bl.y} Z`} fill={TOKENS.colors.platBright} />

                    {/* Edge Highlights */}
                    <path
                        d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} M ${T.apex.x} ${T.apex.y} L ${T.bl.x} ${T.bl.y} M ${T.bl.x} ${T.bl.y} L ${T.br.x} ${T.br.y}`}
                        stroke="white"
                        strokeWidth="0.5"
                        opacity={0.7}
                        fill="none"
                    />

                    {/* Platinum Shine Effect */}
                    <motion.rect
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        fill="url(#plat-metal-shine)"
                        clipPath="url(#tetra-clip)"
                        variants={shineSweep}
                        style={{ mixBlendMode: 'overlay' }}
                    />
                </motion.g>
            </motion.svg>
        </div>
    );
}


/**
 * VERSION 5: "The Living Matrix" (Subtle Pulse)
 * Subtle, persistent state. The logo gently "breathes."
 * 
 * Best for: Footers, navigation bars, static contexts.
 */
export function StaticLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
    return (
        <motion.div className={className} style={{ width: size, height: size }}>
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <SharedDefs />

                {/* --- WIREFRAME CAGE (Breathing) --- */}
                <motion.g
                    animate={{
                        scale: [1, 1.03, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                    style={{ originX: '50%', originY: '50%' }}
                    stroke={TOKENS.colors.teal}
                    strokeWidth="1.5"
                    filter="url(#teal-bloom)"
                >
                    <path
                        d={`M ${V.top.x} ${V.top.y} L ${V.tr.x} ${V.tr.y} L ${V.br.x} ${V.br.y} L ${V.btm.x} ${V.btm.y} L ${V.bl.x} ${V.bl.y} L ${V.tl.x} ${V.tl.y} Z`}
                        fill="none"
                    />
                    <path
                        d={`M ${V.c.x} ${V.c.y} L ${V.top.x} ${V.top.y} M ${V.c.x} ${V.c.y} L ${V.bl.x} ${V.bl.y} M ${V.c.x} ${V.c.y} L ${V.br.x} ${V.br.y}`}
                        opacity={0.5}
                        fill="none"
                    />
                    {/* Nodes */}
                    {[V.top, V.tr, V.br, V.btm, V.bl, V.tl].map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r={1.5} fill="white" />
                    ))}
                </motion.g>

                {/* --- SOLID CORE (Stable but gleams) --- */}
                <g>
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.bl.x} ${T.bl.y} L ${T.back.x} ${T.back.y} Z`} fill={TOKENS.colors.platDark} />
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} L ${T.back.x} ${T.back.y} Z`} fill={TOKENS.colors.platMid} />
                    <path d={`M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y} L ${T.bl.x} ${T.bl.y} Z`} fill={TOKENS.colors.platBright} />
                    {/* Pulsing Edge Highlight */}
                    <motion.path
                        d={`M ${T.apex.x} ${T.apex.y} L ${T.bl.x} ${T.bl.y} M ${T.apex.x} ${T.apex.y} L ${T.br.x} ${T.br.y}`}
                        stroke="white"
                        fill="none"
                        animate={{
                            strokeOpacity: [0.3, 1, 0.3],
                            strokeWidth: [0.5, 1.5, 0.5],
                        }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
                    />
                </g>
            </motion.svg>
        </motion.div>
    );
}


// --- SVG STRING FOR PDF GENERATION ---
export const logoSvgString = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 15 L80.3 32.5 L80.3 67.5 L50 85 L19.7 67.5 L19.7 32.5 Z" stroke="#00d4aa" stroke-width="2" fill="none"/>
  <path d="M50 50 L50 15 M50 50 L80.3 67.5 M50 50 L19.7 67.5" stroke="#00d4aa" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M50 36.25 L36.4 59.13 L50 59.13 Z" fill="#888888"/>
  <path d="M50 36.25 L63.6 59.13 L50 59.13 Z" fill="#c0c0c0"/>
  <path d="M50 36.25 L63.6 59.13 L36.4 59.13 Z" fill="#f0f0f0"/>
</svg>`;
