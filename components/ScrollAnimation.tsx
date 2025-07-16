'use client';
import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OrbitControls } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger);

// A basic spinning cube mesh
const AnimatedBox = ({ meshRef }: { meshRef: React.RefObject<Mesh | null> }) => {
    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

const ScrollAnimation = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const meshRef = useRef<Mesh | null>(null);

    useEffect(() => {
        if (!meshRef.current || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    markers: true, // remove this in production
                },
            });

            tl.to(meshRef.current!.rotation, { y: Math.PI * 2, duration: 1, ease: 'none' }, 0);
            tl.to(meshRef.current!.position, { z: -5, duration: 1, ease: 'power1.inOut' }, 0);
            tl.to(meshRef.current!.scale, { x: 2, y: 2, z: 2, duration: 1 }, 0.5);
        }, containerRef);

        return () => ctx.revert(); // Clean up GSAP context
    }, []);

    return (
        <div ref={containerRef} style={{ height: '200vh' }}>
            <Canvas
                style={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    background: '#000',
                }}
                camera={{ position: [0, 0, 5], fov: 75 }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <AnimatedBox meshRef={meshRef} />
                <OrbitControls enableZoom={false} />
            </Canvas>
        </div>
    );
};

export default ScrollAnimation;
