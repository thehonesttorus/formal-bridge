"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BridgeAnimationProps {
    width?: string;
    height?: number;
}

/**
 * Data Ingestion Pipeline Animation
 * 
 * Visual flow:
 * 1. CHAOS (Left) - Continuous stream of real insolvency data (claims, amounts, regs)
 * 2. CONVERGENCE (Center) - All data funnels into a glowing singularity point
 * 3. VERIFIED OUTPUT (Right) - Real InsolvencyLib Lean code emerges
 * 
 * Data streams CONTINUOUSLY throughout the animation.
 * Code starts at 3 seconds so data and code overlap significantly.
 */
export default function BridgeAnimation({ width = "100%", height = 500 }: BridgeAnimationProps) {
    const [animationKey, setAnimationKey] = useState(0);
    const DURATION = 14000;

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimationKey((prev) => prev + 1);
        }, DURATION);
        return () => clearInterval(timer);
    }, []);

    // --- CHAOS STAGE: Floating data icons converging toward center (gentler flow) ---
    const chaosItemVariants = {
        hidden: (custom: { startX: number; startY: number }) => ({
            opacity: 0,
            x: custom.startX,
            y: custom.startY,
            scale: 0.6,
            rotate: Math.random() * 20 - 10,
        }),
        visible: (custom: { startX: number; startY: number; delay: number; endX: number; endY: number; duration: number }) => ({
            opacity: [0, 0.8, 0.8, 0],
            x: [custom.startX, custom.startX + 100, custom.endX],
            y: [custom.startY, custom.startY + (Math.random() - 0.5) * 20, custom.endY],
            scale: [0.6, 0.9, 0.3],
            rotate: [Math.random() * 20 - 10, 0, 0],
            transition: {
                delay: custom.delay,
                duration: custom.duration || 4,
                ease: [0.25, 0.1, 0.25, 1] as const, // Gentle cubic bezier
                times: [0, 0.3, 1],
            },
        }),
    };

    // --- SINGULARITY: The central convergence point ---
    const singularityVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            transition: { delay: 1.2, duration: 0.8, ease: "easeOut" as const },
        },
    };

    const singularityPulseVariants = {
        hidden: { scale: 1, opacity: 0 },
        visible: {
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
            transition: { delay: 1.8, duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
        },
    };

    // --- CODE OUTPUT: Typing animation ---
    const codeLineVariants = {
        hidden: { opacity: 0, x: -5 },
        visible: (delay: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay, duration: 0.3 },
        }),
    };

    // Real insolvency data items - gentler, less dense flow
    // WAVE 1: Initial creditors (slower, more spaced out)
    const wave1Items = [
        { type: "doc", startX: 25, startY: 120, delay: 0, duration: 4.0 },
        { type: "text", content: "HMRC", startX: 65, startY: 200, delay: 0.6, duration: 4.2 },
        { type: "text", content: "£847K", startX: 45, startY: 320, delay: 1.2, duration: 4.0 },
    ];

    // WAVE 2: More claims (overlaps gently)
    const wave2Items = [
        { type: "text", content: "Barclays", startX: 35, startY: 180, delay: 2.0, duration: 4.5 },
        { type: "doc", startX: 80, startY: 280, delay: 2.8, duration: 4.2 },
        { type: "text", content: "£2.5M", startX: 55, startY: 360, delay: 3.5, duration: 4.0 },
    ];

    // WAVE 3: Regulations and amounts (flows during code output)
    const wave3Items = [
        { type: "text", content: "S.176A", startX: 50, startY: 150, delay: 4.5, duration: 4.5 },
        { type: "doc", startX: 70, startY: 250, delay: 5.5, duration: 4.2 },
        { type: "text", content: "IR2016", startX: 40, startY: 340, delay: 6.5, duration: 4.0 },
    ];

    // WAVE 4: Final gentle stream
    const wave4Items = [
        { type: "text", content: "Pension", startX: 60, startY: 200, delay: 8.0, duration: 4.5 },
        { type: "doc", startX: 45, startY: 300, delay: 9.0, duration: 4.2 },
        { type: "text", content: "£156K", startX: 75, startY: 380, delay: 10.0, duration: 4.0 },
    ];

    // Combine all waves (fewer, gentler items)
    const allChaosItems = [...wave1Items, ...wave2Items, ...wave3Items, ...wave4Items];

    // Real InsolvencyLib Lean code - starts at 3 seconds
    const codeLines = [
        { text: "-- InsolvencyLib.Waterfall", color: "#64748b", delay: 3.0 },
        { text: "def distribute", color: "#00d4aa", delay: 3.5 },
        { text: "  (claims : List (CreditorClass × List Claim))", color: "#e2e8f0", delay: 4.0 },
        { text: "  (available : Int) : List Payment × Int :=", color: "#e2e8f0", delay: 4.5 },
        { text: "  claims.foldl (fun (acc, avail) (tier, cs) =>", color: "#94a3b8", delay: 5.2 },
        { text: "    let tierPayments := distributeToTier cs avail", color: "#e2e8f0", delay: 5.8 },
        { text: "    (acc ++ tierPayments, avail - tierTotal))", color: "#e2e8f0", delay: 6.4 },
        { text: "", color: "", delay: 0 }, // spacer
        { text: "theorem distribute_conserves_value [PROVEN]", color: "#00d4aa", delay: 7.2 },
        { text: "theorem payment_le_claim [PROVEN]", color: "#00d4aa", delay: 7.8 },
    ];

    const centerX = 420;
    const centerY = 250;

    return (
        <div
            className="relative w-full overflow-hidden flex items-center justify-center"
            style={{ height, background: "transparent" }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={animationKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[1000px] relative"
                >
                    <svg
                        viewBox="0 0 1000 500"
                        preserveAspectRatio="xMidYMid meet"
                        className="w-full h-full"
                    >
                        {/* --- DEFINITIONS --- */}
                        <defs>
                            {/* Singularity Glow */}
                            <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                                <stop offset="30%" stopColor="#00d4aa" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
                            </radialGradient>

                            {/* Outer pulse glow */}
                            <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
                            </radialGradient>

                            {/* Flow lines gradient */}
                            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="#00d4aa" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0.1" />
                            </linearGradient>

                            {/* Glow filter */}
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* --- BACKGROUND: Subtle perspective grid --- */}
                        <g opacity="0.1">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <line
                                    key={`v-${i}`}
                                    x1={-200 + i * 80}
                                    y1={500}
                                    x2={centerX}
                                    y2={centerY}
                                    stroke="#00d4aa"
                                    strokeWidth="1"
                                />
                            ))}
                            {Array.from({ length: 15 }).map((_, i) => (
                                <line
                                    key={`v2-${i}`}
                                    x1={1200 - i * 80}
                                    y1={500}
                                    x2={centerX}
                                    y2={centerY}
                                    stroke="#00d4aa"
                                    strokeWidth="1"
                                />
                            ))}
                        </g>

                        {/* --- FLOW LINES: Funnel paths converging to center --- */}
                        <g opacity="0.15">
                            <motion.path
                                d={`M 0 80 Q 200 120 ${centerX} ${centerY}`}
                                fill="none"
                                stroke="url(#flowGradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.2, duration: 1.8 }}
                            />
                            <motion.path
                                d={`M 0 200 Q 180 220 ${centerX} ${centerY}`}
                                fill="none"
                                stroke="url(#flowGradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.4, duration: 1.8 }}
                            />
                            <motion.path
                                d={`M 0 320 Q 200 300 ${centerX} ${centerY}`}
                                fill="none"
                                stroke="url(#flowGradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.6, duration: 1.8 }}
                            />
                            <motion.path
                                d={`M 0 420 Q 180 380 ${centerX} ${centerY}`}
                                fill="none"
                                stroke="url(#flowGradient)"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.8, duration: 1.8 }}
                            />
                            {/* Exit flow to code */}
                            <motion.path
                                d={`M ${centerX} ${centerY} Q 600 ${centerY} 560 180`}
                                fill="none"
                                stroke="#00d4aa"
                                strokeWidth="2"
                                strokeOpacity="0.3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 2.0, duration: 1.2 }}
                            />
                        </g>

                        {/* --- CONTINUOUS DATA STREAM (All waves combined) --- */}
                        <g>
                            {allChaosItems.map((item, i) => (
                                <motion.g
                                    key={`chaos-${i}`}
                                    custom={{
                                        startX: item.startX,
                                        startY: item.startY,
                                        delay: item.delay,
                                        duration: item.duration,
                                        endX: centerX,
                                        endY: centerY,
                                    }}
                                    variants={chaosItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {item.type === "doc" ? (
                                        // Document icon
                                        <g>
                                            <rect
                                                x="-12"
                                                y="-16"
                                                width="24"
                                                height="32"
                                                fill="none"
                                                stroke="#64748b"
                                                strokeWidth="1.5"
                                                rx="2"
                                            />
                                            <line x1="-6" y1="-6" x2="6" y2="-6" stroke="#64748b" strokeWidth="1" />
                                            <line x1="-6" y1="0" x2="4" y2="0" stroke="#64748b" strokeWidth="1" />
                                            <line x1="-6" y1="6" x2="6" y2="6" stroke="#64748b" strokeWidth="1" />
                                        </g>
                                    ) : (
                                        // Text symbol
                                        <text
                                            fill="#94a3b8"
                                            fontSize="13"
                                            fontFamily="'Fira Code', 'Consolas', monospace"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            {item.content}
                                        </text>
                                    )}
                                </motion.g>
                            ))}
                        </g>

                        {/* --- SINGULARITY (Center convergence point) --- */}
                        <g transform={`translate(${centerX}, ${centerY})`}>
                            {/* Outer pulse */}
                            <motion.circle
                                r="60"
                                fill="url(#pulseGlow)"
                                variants={singularityPulseVariants}
                                initial="hidden"
                                animate="visible"
                            />

                            {/* Core glow */}
                            <motion.circle
                                r="25"
                                fill="url(#singularityGlow)"
                                filter="url(#glow)"
                                variants={singularityVariants}
                                initial="hidden"
                                animate="visible"
                            />

                            {/* Inner bright core */}
                            <motion.circle
                                r="8"
                                fill="#ffffff"
                                variants={singularityVariants}
                                initial="hidden"
                                animate="visible"
                            />

                            {/* Label */}
                            <motion.text
                                y="50"
                                fill="#00d4aa"
                                fontSize="10"
                                fontFamily="'Inter', sans-serif"
                                textAnchor="middle"
                                letterSpacing="2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.7 }}
                                transition={{ delay: 2.0 }}
                            >
                                VERIFICATION
                            </motion.text>
                        </g>

                        {/* --- CODE OUTPUT (Real InsolvencyLib Lean code) --- */}
                        <g transform="translate(560, 105)">
                            {/* No background - code floats transparently on main section */}

                            {/* Code lines */}
                            <g fontFamily="'Fira Code', 'Consolas', monospace" fontSize="11">
                                {codeLines.map((line, i) => (
                                    line.text && (
                                        <motion.text
                                            key={i}
                                            x="0"
                                            y={i * 26}
                                            fill={line.color}
                                            custom={line.delay}
                                            variants={codeLineVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {line.text}
                                        </motion.text>
                                    )
                                ))}
                            </g>

                            {/* Verified overlay - covers code panel gradually */}
                            <motion.g
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 9, duration: 2, ease: "easeIn" }}
                            >
                                {/* Dark overlay that gradually covers the code */}
                                <rect
                                    x="-15"
                                    y="-15"
                                    width="420"
                                    height="300"
                                    rx="6"
                                    fill="rgba(10, 14, 26, 0.92)"
                                />
                                {/* Centered text - two lines */}
                                <text
                                    x="195"
                                    y="115"
                                    textAnchor="middle"
                                    fill="#00d4aa"
                                    fontSize="18"
                                    fontFamily="'Inter', sans-serif"
                                    letterSpacing="3"
                                    fontWeight="500"
                                >
                                    COMPLIANCE
                                </text>
                                <text
                                    x="195"
                                    y="150"
                                    textAnchor="middle"
                                    fill="#00d4aa"
                                    fontSize="28"
                                    fontFamily="'Inter', sans-serif"
                                    letterSpacing="6"
                                    fontWeight="bold"
                                >
                                    VERIFIED
                                </text>
                                {/* Checkmark icon */}
                                <motion.circle
                                    cx="195"
                                    cy="175"
                                    r="20"
                                    fill="none"
                                    stroke="#00d4aa"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 10.5, duration: 0.5 }}
                                />
                                <motion.path
                                    d="M 183 175 L 191 183 L 207 167"
                                    fill="none"
                                    stroke="#00d4aa"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 11, duration: 0.4 }}
                                />
                            </motion.g>
                        </g>
                    </svg>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
