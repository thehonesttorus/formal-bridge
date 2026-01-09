"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// --- DESIGN TOKENS ---
const TOKENS = {
    colors: {
        teal: 0x00d4aa,
        tealHex: '#00d4aa',
        platinum: 0xe0e0e0,
        platinumHex: '#f0f0f0',
        bg: '#0a0e1a',
        bgNum: 0x0a0e1a
    },
};

// --- THREE.JS ENGINE COMPONENT ---
interface ThreeDLogoProps {
    mode?: 'standard' | 'counter' | 'orbit' | 'sync' | 'glitch';
    active?: boolean;
}

const ThreeDLogo = ({ mode = 'standard', active = false }: ThreeDLogoProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 1. Scene Setup
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Orthographic camera often looks better for logos, but perspective was requested in snippet
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
        mountRef.current.appendChild(renderer.domElement);

        // 2. Lighting (Crucial for the "Platinum" finish)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);

        const tealPointLight = new THREE.PointLight(TOKENS.colors.teal, 2, 10);
        tealPointLight.position.set(-2, -2, 2);
        scene.add(tealPointLight);

        // 3. The "Verification Matrix" (Wireframe Cube)
        const cubeSize = 2;
        const cubeGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeEdges = new THREE.EdgesGeometry(cubeGeom);
        const cubeMat = new THREE.LineBasicMaterial({
            color: TOKENS.colors.teal,
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });
        const cube = new THREE.LineSegments(cubeEdges, cubeMat);
        scene.add(cube);

        // Vertex Nodes (Data Points)
        const nodeGeom = new THREE.SphereGeometry(0.04, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        // Use position attribute to place spheres
        const posAttribute = cubeGeom.attributes.position;
        for (let i = 0; i < posAttribute.count; i++) {
            const x = posAttribute.getX(i);
            const y = posAttribute.getY(i);
            const z = posAttribute.getZ(i);

            // Check if we already have a sphere here (BoxGeometry duplicates vertices for faces)
            // Simple workaround: just add them, performance impact is negligible for 8-24 vertices
            const sphere = new THREE.Mesh(nodeGeom, nodeMat);
            sphere.position.set(x, y, z);
            cube.add(sphere);
        }
        // Clean up duplicate spheres if we want perfection, but visually fine. 
        // Actually BoxGeometry has 24 verts. EdgesGeometry handles the lines.

        // 4. The "Proof Core" (Solid Tetrahedron)
        const tetraGeom = new THREE.TetrahedronGeometry(0.9);
        const tetraMat = new THREE.MeshStandardMaterial({
            color: TOKENS.colors.platinum,
            metalness: 0.9,
            roughness: 0.1,
            flatShading: true
        });
        const tetrahedron = new THREE.Mesh(tetraGeom, tetraMat);
        scene.add(tetrahedron);

        // Outline for tetrahedron to sharpen its look
        const tetraEdges = new THREE.EdgesGeometry(tetraGeom);
        const tetraLine = new THREE.LineSegments(tetraEdges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true }));
        tetrahedron.add(tetraLine);

        // 5. Animation Loop
        let frame = 0;
        const animate = () => {
            frame += 0.01;

            switch (mode) {
                case 'counter':
                    cube.rotation.y += 0.005;
                    cube.rotation.x += 0.002;
                    tetrahedron.rotation.y -= 0.015;
                    tetrahedron.rotation.z += 0.005;
                    break;

                case 'orbit':
                    cube.rotation.y = Math.sin(frame * 0.5) * 0.5;
                    cube.rotation.x = Math.cos(frame * 0.3) * 0.5;
                    tetrahedron.rotation.y = frame * 2;
                    tetrahedron.position.y = Math.sin(frame) * 0.1;
                    break;

                case 'sync':
                    cube.rotation.y += 0.01;
                    cube.rotation.x = 0.5;
                    tetrahedron.rotation.y += 0.01;
                    tetrahedron.rotation.x = 0.5;
                    break;

                case 'glitch':
                    if (Math.random() > 0.98) {
                        cube.rotation.x = Math.random() * Math.PI;
                        cube.rotation.y = Math.random() * Math.PI;
                    } else {
                        cube.rotation.y += 0.002;
                    }
                    tetrahedron.rotation.y += 0.05;
                    break;

                default:
                    // Standard "Diamond Stance" Drift
                    cube.rotation.y += 0.005;
                    cube.rotation.x = 0.6;
                    cube.rotation.z = 0.6; // Diamond tilt
                    tetrahedron.rotation.y -= 0.01;
            }

            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestRef.current);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            // Cleanup Three.js resources
            renderer.dispose();
            cubeGeom.dispose();
            cubeMat.dispose();
            nodeGeom.dispose();
            nodeMat.dispose();
            tetraGeom.dispose();
            tetraMat.dispose();
        };
    }, [mode]);

    return <div ref={mountRef} className="w-full h-full pointer-events-none" />;
};

// --- MAIN EXPORT WRAPPER ---
interface LogoProps {
    size?: number;
    animated?: boolean;
    className?: string;
    mode?: 'standard' | 'counter' | 'orbit' | 'sync' | 'glitch';
}

export default function FormalBridgeLogo({
    size = 64,
    animated = true,
    className = "",
    mode = 'standard'
}: LogoProps) {
    // If not animated, we could fallback to StaticLogo, but let's assume if they use this component they want the 3D canvas unless explicitly minimal.
    // However, keeping React/Three overhead low for lists is good.
    // For now, render ThreeDLogo if animated.

    if (!animated) {
        return <StaticLogo size={size} />;
    }

    return (
        <div style={{ width: size, height: size }} className={`relative ${className}`}>
            <ThreeDLogo mode={mode} active={true} />
        </div>
    );
}

// --- STATIC EXPORT FOR PDF/FOOTER ---
// Reusing the vectorized SVG version for static contexts where WebGL is overkill
export function StaticLogo({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 18 L79 34 L79 66 L50 82 L21 66 L21 34 Z" stroke="#00d4aa" strokeWidth="2" fill="none" />
            <path d="M50 50 L50 18 M50 50 L79 66 M50 50 L21 66" stroke="#00d4aa" strokeWidth="2" opacity="0.7" />
            <path d="M50 35 L36 58 L50 65 Z" fill="#cbd5e1" />
            <path d="M50 35 L64 58 L50 65 Z" fill="#64748b" />
        </svg>
    );
}

// --- SVG STRING FOR PDF GENERATION ---
export const logoSvgString = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 18 L79 34 L79 66 L50 82 L21 66 L21 34 Z" stroke="#00d4aa" stroke-width="2" fill="none"/>
  <path d="M50 50 L50 18 M50 50 L79 66 M50 50 L21 66" stroke="#00d4aa" stroke-width="2" fill="none" opacity="0.6"/>
  <path d="M50 35 L36 58 L50 65 Z" fill="#cbd5e1"/>
  <path d="M50 35 L64 58 L50 65 Z" fill="#64748b"/>
</svg>`;
