"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Preload } from "@react-three/drei";
import { Suspense } from "react";

interface SceneProps {
    children: React.ReactNode;
    className?: string;
    cameraPosition?: [number, number, number];
}

export default function Scene({ children, className, cameraPosition = [0, 0, 5] }: SceneProps) {
    return (
        <div className={`absolute inset-0 z-0 ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    {children}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
