"use client";

import { useFrame } from "@react-three/fiber";
import { Float, Instance, Instances, Line } from "@react-three/drei";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

const NODE_COUNT = 40;
const CONNECTION_DISTANCE = 3.5;

function Connections({ nodes }: { nodes: THREE.Vector3[] }) {
    const lineGeometry = useMemo(() => {
        const points: THREE.Vector3[] = [];
        // Simple distance-based connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < CONNECTION_DISTANCE) {
                    points.push(nodes[i]);
                    points.push(nodes[j]);
                }
            }
        }
        return points;
    }, [nodes]);

    return (
        <Line
            worldUnits
            points={lineGeometry}
            color="#00d4aa"
            opacity={0.15}
            transparent
            lineWidth={1}
        />
    );
}

export default function LogicTree() {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHover] = useState<number | null>(null);

    // Generate random node positions in a sphere
    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 3 + Math.random() * 2; // Radius 3-5

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef}>
                <Connections nodes={nodes} />

                <Instances range={NODE_COUNT}>
                    <icosahedronGeometry args={[0.15, 0]} />
                    <meshStandardMaterial
                        color="#00d4aa"
                        emissive="#00d4aa"
                        emissiveIntensity={0.5}
                        toneMapped={false}
                    />

                    {nodes.map((pos, i) => (
                        <group key={i} position={pos}
                            onPointerOver={() => setHover(i)}
                            onPointerOut={() => setHover(null)}
                        >
                            <Instance
                                scale={hovered === i ? 1.5 : 1}
                                color={hovered === i ? "#ffffff" : "#00d4aa"}
                            />
                            {/* Glow effect sprite could go here */}
                        </group>
                    ))}
                </Instances>
            </group>
        </Float>
    );
}
