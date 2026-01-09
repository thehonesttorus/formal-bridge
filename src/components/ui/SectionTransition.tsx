"use client";

import { motion } from "framer-motion";

/**
 * SectionTransition
 * A seamless visual bridge between Hero (grid) and Waterfall (droplets)
 * Creates a "high budget production" feel by blending the two aesthetics
 */
export default function SectionTransition() {
    return (
        <div className="relative h-64 -mt-32 overflow-hidden pointer-events-none">
            {/* Fade from Hero background */}
            <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/50 to-transparent z-10" />

            {/* Grid lines fading out */}
            <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `linear-gradient(#00d4aa 1px, transparent 1px), linear-gradient(90deg, #00d4aa 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    maskImage: 'linear-gradient(to bottom, white, transparent)'
                }}
            />

            {/* Falling particles / droplets emerging */}
            <div className="absolute inset-0 flex justify-center gap-32">
                {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                        key={i}
                        className="w-px bg-gradient-to-b from-transparent via-teal/30 to-teal/60"
                        style={{ height: '100%' }}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                    />
                ))}
            </div>

            {/* Glowing orbs transitioning to droplets */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-20">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={`orb-${i}`}
                        className="w-2 h-2 rounded-full bg-teal"
                        style={{ boxShadow: '0 0 20px #00d4aa, 0 0 40px #00d4aa50' }}
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: [0, 1, 0.5], y: [0, 64, 128] }}
                        transition={{
                            delay: 0.5 + i * 0.2,
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeIn"
                        }}
                    />
                ))}
            </div>

            {/* Horizontal divider line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal/50 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </div>
    );
}
