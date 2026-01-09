"use client";

import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 200;

export default function Waterfall3D() {
    const particlesRef = useRef<THREE.Group>(null);

    // Initial random positions for particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const x = (Math.random() - 0.5) * 4; // Spread width
            const y = Math.random() * 6 + 1;     // Start height
            const z = (Math.random() - 0.5) * 1; // Depth
            const speed = 0.02 + Math.random() * 0.03;
            temp.push({
                position: new THREE.Vector3(x, y, z),
                resetY: y,
                speed
            });
        }
        return temp;
    }, []);

    useFrame(() => {
        // Animate particles falling
        particles.forEach((p, i) => {
            p.position.y -= p.speed;

            // Reset if below threshold
            if (p.position.y < -3) {
                p.position.y = p.resetY;
                p.position.x = (Math.random() - 0.5) * 4; // Reshuffle x
            }

            // Update instance position (conceptual - need to update Instance refs or use a shader for best perf)
            // Since we are using <Instance> components from drei, we can access their refs if we mapped them properly,
            // but for this simplified version, animating the entire group is tricky without prop drilling refs.
            // Better approach for high perf: Updating the InstancedMesh directly. 
            // For this demo 'professional feel', we will use a slightly less performant but declarative way 
            // or just animate the group for flow effect.

            // Actually, 'drei/Instance' allows ref access. Let's assume static flow for now or use a simple sway 
            // if not fully rigging individual particles in this snippet. 
            // To keep it stunning but simple code-wise, let's make the whole group rotate slowly 
            // and maybe have a few separate groups falling.
        });
    });

    return (
        <group ref={particlesRef}>
            {/* Tiered Glass Plates */}
            <mesh position={[0, 2, 0]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[4, 0.1, 2]} />
                <meshPhysicalMaterial
                    transmission={0.9}
                    roughness={0.1}
                    thickness={0.5}
                    color="#00d4aa"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            <mesh position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[4, 0.1, 2]} />
                <meshPhysicalMaterial
                    transmission={0.9}
                    roughness={0.1}
                    thickness={0.5}
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                />
            </mesh>

            <mesh position={[0, -2, 0]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[4, 0.1, 2]} />
                <meshPhysicalMaterial
                    transmission={0.9}
                    roughness={0.1}
                    thickness={0.5}
                    color="#141c2f"
                    transparent
                    opacity={0.5}
                />
            </mesh>

            {/* Floating Particles */}
            <Instances range={PARTICLE_COUNT}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color="#00d4aa" />

                {particles.map((data, i) => (
                    <FloatingParticle key={i} data={data} />
                ))}
            </Instances>
        </group>
    );
}

function FloatingParticle({ data }: { data: any }) {
    const ref = useRef<any>(null);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.y -= data.speed;
            if (ref.current.position.y < -3) {
                ref.current.position.y = 4;
            }
        }
    });

    return <Instance ref={ref} position={data.position} />;
}
