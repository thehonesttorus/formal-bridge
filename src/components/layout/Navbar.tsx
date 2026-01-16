"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import FormalBridgeLogo from "@/components/ui/DynamicLogo";
import { createClient } from "@/lib/supabase/browser";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoKey, setLogoKey] = useState(0);
    const [user, setUser] = useState<{ email: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check auth state on mount
    useEffect(() => {
        let subscription: { unsubscribe: () => void } | null = null;

        const initAuth = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user ? { email: user.email || '' } : null);
                setLoading(false);

                // Listen for auth changes
                const { data } = supabase.auth.onAuthStateChange((_event: string, session: { user?: { email?: string } } | null) => {
                    setUser(session?.user ? { email: session.user.email || '' } : null);
                });
                subscription = data.subscription;
            } catch (err) {
                console.error('Failed to initialize auth:', err);
                setLoading(false);
            }
        };

        initAuth();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const replayLogo = () => setLogoKey(prev => prev + 1);

    const handleSignOut = async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            setUser(null);
            router.push('/');
        } catch (err) {
            console.error('Failed to sign out:', err);
        }
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                ? "bg-midnight/80 backdrop-blur-xl border-b border-white/5 py-4"
                : "bg-transparent border-b border-transparent py-6"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-4 group cursor-pointer"
                    onClick={replayLogo}
                >
                    <FormalBridgeLogo key={logoKey} size={64} animated={true} />
                    <h1 className="text-2xl font-bold tracking-[0.15em] text-white group-hover:text-teal transition-colors">
                        FORMAL BRIDGE
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    <Link
                        href="#platform"
                        className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
                    >
                        Platform
                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                    <Link
                        href="#expertise"
                        className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors relative group"
                    >
                        The Science
                        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>
                </div>

                {/* Auth Section */}
                <div className="hidden md:flex items-center gap-6">
                    {loading ? (
                        <div className="w-24 h-10 bg-slate-800/50 rounded animate-pulse" />
                    ) : user ? (
                        <>
                            <Link
                                href="/portal"
                                className="px-6 py-3 text-teal text-sm font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                            >
                                <User className="w-4 h-4" />
                                Portal
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="px-6 py-3 border border-slate-700 text-slate-400 text-sm font-bold uppercase tracking-widest hover:border-red-500/50 hover:text-red-400 transition-all"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-6 py-3 text-slate-400 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-8 py-3 border border-teal/30 bg-teal/10 text-teal text-sm font-bold uppercase tracking-widest hover:bg-teal hover:text-midnight transition-all"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}
