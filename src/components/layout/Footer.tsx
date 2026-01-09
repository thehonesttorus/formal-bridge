import Link from "next/link";
import { StaticLogo } from "@/components/ui/DynamicLogo";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                    <div className="flex items-center gap-4">
                        <StaticLogo size={28} />
                        <span className="text-lg font-bold tracking-[0.15em] text-white">FORMAL BRIDGE</span>
                    </div>
                    <p className="text-slate-600 text-xs tracking-widest uppercase">
                        Designed for High-Integrity Financial Environments
                    </p>
                </div>

                {/* Legal Links */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-800/50">
                    <p className="text-slate-600 text-xs">
                        © {currentYear} Formal Bridge Ltd. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs">
                        <Link
                            href="/terms"
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            Terms of Business
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-slate-500 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-slate-700">|</span>
                        <span className="text-slate-600 font-mono text-[10px]">
                            InsolvencyLib v1.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
