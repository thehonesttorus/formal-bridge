"use client";

import { motion } from "framer-motion";

const TOKENS = {
    colors: {
        teal: '#00d4aa',
    }
};

/**
 * DataPlaneBackground
 * A perspective grid that moves slowly, giving a sense of scale.
 */
export default function DataPlaneBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight to-navy-900 z-10" />

            {/* The Grid Mesh */}
            <motion.div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(${TOKENS.colors.teal} 1px, transparent 1px), linear-gradient(90deg, ${TOKENS.colors.teal} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
                    transformOrigin: 'top center'
                }}
                animate={{
                    backgroundPosition: ['0px 0px', '0px 80px']
                }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                }}
            />

            {/* Vignette */}
            <div
                className="absolute inset-0 z-20"
                style={{ background: 'radial-gradient(circle at center, transparent 0%, #0a0e1a 70%)' }}
            />
        </div>
    );
}
