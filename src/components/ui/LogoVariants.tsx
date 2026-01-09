"use client";

import { motion } from "framer-motion";

interface LogoProps { size?: number; }

/**
 * 1. THE LAMBDA (λ)
 * Mathematical symbol representing functional purity and Lean's foundation
 */
export function LambdaLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <motion.path
                d="M 12 8 L 20 32 M 20 32 L 28 8 M 16 20 L 24 20"
                stroke="#00d4aa"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.circle
                cx="20" cy="20" r="2"
                fill="#ffffff"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
            />
        </motion.svg>
    );
}

/**
 * 2. THE CHECKMARK SEAL
 * Official verification stamp - trust and authority
 */
export function SealLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <motion.circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />
            <motion.circle
                cx="20" cy="20" r="12"
                fill="none"
                stroke="#00d4aa"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            />
            <motion.path
                d="M 13 20 L 18 25 L 27 15"
                stroke="#00d4aa"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            />
        </motion.svg>
    );
}

/**
 * 3. THE CASCADE
 * Waterfall tiers - flowing down, each tier verified
 */
export function CascadeLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            {[
                { y: 8, w: 28, delay: 0 },
                { y: 16, w: 22, delay: 0.2 },
                { y: 24, w: 16, delay: 0.4 },
                { y: 32, w: 10, delay: 0.6 },
            ].map((tier, i) => (
                <motion.rect
                    key={i}
                    x={(40 - tier.w) / 2}
                    y={tier.y}
                    width={tier.w}
                    height="4"
                    rx="2"
                    fill={i === 3 ? "#00d4aa" : "#334155"}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: tier.delay, duration: 0.4 }}
                />
            ))}
            <motion.circle
                cx="20" cy="34"
                r="2"
                fill="#ffffff"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ delay: 1 }}
            />
        </motion.svg>
    );
}

/**
 * 4. THE BALANCE
 * Scales of justice - precision and fairness
 */
export function BalanceLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <motion.path
                d="M 20 6 L 20 34 M 8 34 L 32 34"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
            />
            <motion.path
                d="M 8 14 L 20 10 L 32 14"
                stroke="#00d4aa"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
            />
            <motion.circle cx="8" cy="14" r="3" fill="#00d4aa" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
            <motion.circle cx="32" cy="14" r="3" fill="#00d4aa" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
            <motion.circle cx="20" cy="10" r="2" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
        </motion.svg>
    );
}

/**
 * 5. THE BRIDGE
 * Literal bridge connecting two pillars (law ↔ finance)
 */
export function BridgeLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <rect x="6" y="18" width="6" height="16" fill="#1e293b" />
            <rect x="28" y="18" width="6" height="16" fill="#1e293b" />
            <motion.path
                d="M 9 18 Q 20 4 31 18"
                stroke="#00d4aa"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
            />
            <motion.circle
                cx="20" cy="11"
                r="3"
                fill="#00d4aa"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
            />
            <motion.circle cx="20" cy="11" r="1.5" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} />
        </motion.svg>
    );
}

/**
 * 6. THE THEOREM (∴)
 * Therefore symbol - logical conclusion
 */
export function ThereforeLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <rect x="8" y="8" width="24" height="24" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            {[[14, 14], [26, 14], [20, 26]].map(([cx, cy], i) => (
                <motion.circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#00d4aa"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.2, type: "spring" }}
                />
            ))}
            <motion.circle cx="20" cy="26" r="2" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
        </motion.svg>
    );
}

/**
 * 7. THE LEDGER
 * Grid of verified cells - data integrity
 */
export function LedgerLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <rect x="6" y="6" width="28" height="28" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="6" y1="15" x2="34" y2="15" stroke="#1e293b" strokeWidth="1" />
            <line x1="6" y1="24" x2="34" y2="24" stroke="#1e293b" strokeWidth="1" />
            <line x1="15" y1="6" x2="15" y2="34" stroke="#1e293b" strokeWidth="1" />
            <line x1="24" y1="6" x2="24" y2="34" stroke="#1e293b" strokeWidth="1" />
            {[[10.5, 10.5], [19.5, 19.5], [28.5, 28.5], [10.5, 28.5], [28.5, 10.5]].map(([cx, cy], i) => (
                <motion.circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#00d4aa"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                />
            ))}
        </motion.svg>
    );
}

/**
 * 8. THE PRISM
 * Light refracting through precision - transforming complexity into clarity
 */
export function PrismLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <motion.path
                d="M 20 6 L 34 32 L 6 32 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />
            <motion.line x1="4" y1="20" x2="20" y2="20" stroke="#94a3b8" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
            <motion.line x1="20" y1="20" x2="36" y2="14" stroke="#00d4aa" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
            <motion.line x1="20" y1="20" x2="36" y2="26" stroke="#00f0c0" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
            <motion.circle cx="20" cy="20" r="3" fill="#00d4aa" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} />
        </motion.svg>
    );
}

/**
 * 9. THE CHAIN
 * Linked blocks - immutable record, blockchain-inspired
 */
export function ChainLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            {[{ x: 4, delay: 0 }, { x: 15, delay: 0.2 }, { x: 26, delay: 0.4 }].map((block, i) => (
                <motion.g key={i}>
                    <motion.rect
                        x={block.x}
                        y="12"
                        width="10"
                        height="16"
                        fill={i === 2 ? "#00d4aa" : "#1e293b"}
                        stroke={i === 2 ? "#00f0c0" : "#334155"}
                        strokeWidth="1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: block.delay, type: "spring" }}
                    />
                    {i < 2 && (
                        <motion.line
                            x1={block.x + 10}
                            y1="20"
                            x2={block.x + 15}
                            y2="20"
                            stroke="#00d4aa"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: block.delay + 0.3 }}
                        />
                    )}
                </motion.g>
            ))}
            <motion.circle cx="31" cy="20" r="2" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
        </motion.svg>
    );
}

/**
 * 10. THE CROWN
 * Authority and sovereignty - premium, institutional
 */
export function CrownLogo({ size = 32 }: LogoProps) {
    return (
        <motion.svg viewBox="0 0 40 40" width={size} height={size}>
            <motion.path
                d="M 6 28 L 6 16 L 14 22 L 20 10 L 26 22 L 34 16 L 34 28 Z"
                fill="#1e293b"
                stroke="#00d4aa"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
            />
            {[[14, 22], [20, 10], [26, 22]].map(([cx, cy], i) => (
                <motion.circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={i === 1 ? 3 : 2}
                    fill="#00d4aa"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.15 }}
                />
            ))}
            <motion.circle cx="20" cy="10" r="1.5" fill="#ffffff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} />
            <motion.rect x="6" y="30" width="28" height="4" rx="1" fill="#00d4aa" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.5 }} />
        </motion.svg>
    );
}
