import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import WaterfallViz from "@/components/sections/WaterfallViz";
import ProofEngine from "@/components/sections/ProofEngine";
import Expertise from "@/components/sections/Expertise";
import Trust from "@/components/sections/Trust";
import DataPlaneBackground from "@/components/ui/DataPlaneBackground";

export default function Home() {
    return (
        <main className="bg-midnight min-h-screen selection:bg-teal selection:text-midnight relative">
            {/* Global Fixed Background */}
            <div className="fixed inset-0 z-0">
                <DataPlaneBackground />
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 text-white">
                <Navbar />
                <Hero />
                <div id="platform">
                    <div id="waterfall">
                        <WaterfallViz />
                    </div>
                </div>
                <ProofEngine />
                <Expertise />
                <div id="trust">
                    <Trust />
                </div>
                <Footer />
            </div>
        </main>
    );
}
