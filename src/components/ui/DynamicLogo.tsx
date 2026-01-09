"use client";

import { motion } from "framer-motion";

// --- BRAND CONSTANTS & TOKENS ---
const TOKENS = {
    colors: {
        teal: '#00d4aa',
    }
};

// --- HIGH-FIDELITY LOGO COMPONENT ---
interface LogoProps {
    size?: number;
    animated?: boolean;
    className?: string;
    startDelay?: number;
}

export default function FormalBridgeLogo({
    size = 64,
    animated = false,
    className = "",
    startDelay = 0
}: LogoProps) {

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
                initial={animated ? "hidden" : "visible"}
                animate="visible"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    {/* MATERIAL DEFINITION: Brushed Steel */}
                    <linearGradient id="steel-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#e2e8f0" />
                        <stop offset="50%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>

                    {/* MATERIAL DEFINITION: Luminous Teal */}
                    <linearGradient id="teal-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#00d4aa" />
                        <stop offset="100%" stopColor="#009688" />
                    </linearGradient>

                    {/* MATERIAL DEFINITION: Lighting Glint */}
                    <linearGradient id="glint" x1="0" y1="0" x2="1" y2="0.5">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="45%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                        <stop offset="55%" stopColor="rgba(255,255,255,0.1)" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 1. THE PILLAR (Foundation) */}
                <motion.rect
                    x="15" y="15" width="25" height="70"
                    fill="url(#steel-gradient)"
                    filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: startDelay, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                />

                {/* 2. THE SPAN (Distribution) */}
                <motion.path
                    d="M40 15 H85 V40 H40 V15 Z"
                    fill="url(#steel-gradient)"
                    style={{ originX: 0 }}
                    filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.5))"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: startDelay + 0.4, duration: 0.6, ease: "circOut" }}
                />

                {/* 3. THE BRACE (Verification) - Using Teal + Glow */}
                <motion.path
                    d="M40 40 L85 40 L40 85 V40 Z"
                    fill="url(#teal-gradient)"
                    filter="url(#glow-teal)"
                    initial={{ x: -20, y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    transition={{
                        delay: startDelay + 0.8,
                        type: "spring" as const,
                        stiffness: 300,
                        damping: 15
                    }}
                />

                {/* 4. THE SHOCKWAVE (Impact) */}
                <motion.circle
                    cx="40" cy="40" r="10"
                    stroke={TOKENS.colors.teal}
                    fill="none"
                    initial={{ scale: 0, opacity: 0, strokeWidth: 10 }}
                    animate={{ scale: 2.5, opacity: 0, strokeWidth: 0 }}
                    transition={{ delay: startDelay + 0.85, duration: 0.8, ease: "easeOut" }}
                />

                {/* 5. METALLIC SHIMMER OVERLAY */}
                <mask id="logo-mask">
                    <rect x="15" y="15" width="25" height="70" fill="white" />
                    <path d="M40 15 H85 V40 H40 V15 Z" fill="white" />
                    <path d="M40 40 L85 40 L40 85 V40 Z" fill="white" />
                </mask>

                <motion.rect
                    x="0" y="0" width="100" height="100"
                    fill="url(#glint)"
                    mask="url(#logo-mask)"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
                    transition={{ delay: startDelay + 1.0, duration: 1.2, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
                />

            </motion.svg>
        </motion.div>
    );
}

/**
 * Static version for contexts without animation
 */
export function StaticLogo({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="static-steel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id="static-teal" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00d4aa" />
                    <stop offset="100%" stopColor="#009688" />
                </linearGradient>
            </defs>
            <rect x="15" y="15" width="25" height="70" fill="url(#static-steel)" />
            <path d="M40 15 H85 V40 H40 V15 Z" fill="url(#static-steel)" />
            <path d="M40 40 L85 40 L40 85 V40 Z" fill="url(#static-teal)" />
        </svg>
    );
}
