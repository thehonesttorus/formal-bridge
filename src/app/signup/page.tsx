'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/browser';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Loader2, ChevronRight } from 'lucide-react';
import FormalBridgeLogo from '@/components/ui/DynamicLogo';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for a confirmation link to complete your registration.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-midnight flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-30" />
            <div className="absolute inset-0 bg-radial-glow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Back to home</span>
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="glass-card p-10"
                >
                    {/* Logo & Header */}
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex justify-center mb-8"
                        >
                            <FormalBridgeLogo size={72} mode="standard" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl font-light text-white mb-3"
                        >
                            Create Account
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-slate-500 text-sm"
                        >
                            Start with 3 free audit certificates
                        </motion.p>
                    </div>

                    <motion.form
                        onSubmit={handleSignup}
                        className="space-y-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                                Full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Smith"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-navy-900 border border-navy-700 rounded-none text-white placeholder-slate-600 focus:outline-none focus:border-teal transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-navy-900 border border-navy-700 rounded-none text-white placeholder-slate-600 focus:outline-none focus:border-teal transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    className="w-full pl-12 pr-4 py-3.5 bg-navy-900 border border-navy-700 rounded-none text-white placeholder-slate-600 focus:outline-none focus:border-teal transition-colors"
                                />
                            </div>
                            <p className="text-xs text-slate-600 mt-2">Minimum 8 characters</p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 border border-red-500/30 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Success message */}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 border border-teal/30 text-teal text-sm"
                            >
                                {message}
                            </motion.div>
                        )}

                        {/* Submit button - matching Hero style */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-14 bg-teal overflow-hidden flex items-center justify-center disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 text-midnight font-bold tracking-wide text-sm uppercase flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </span>
                        </button>
                    </motion.form>

                    {/* Sign in link */}
                    <p className="text-center text-slate-500 mt-8 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-teal transition-colors">
                            Sign in
                        </Link>
                    </p>

                    {/* Terms */}
                    <p className="text-center text-xs text-slate-600 mt-6">
                        By signing up, you agree to our{' '}
                        <Link href="/terms" className="text-slate-500 hover:text-white transition-colors">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
                    </p>
                </motion.div>

                {/* Trust indicators - matching site style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex justify-center gap-8 mt-10"
                >
                    <span className="text-xs text-slate-600 font-light tracking-wide">Zero-Retention</span>
                    <span className="text-slate-800">|</span>
                    <span className="text-xs text-slate-600 font-light tracking-wide">Lean 4 Verified</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
