'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const ThreeSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const width = sectionRef.current.offsetWidth;
        const height = sectionRef.current.offsetHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 10);
        camera.position.z = 5.05;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            precision: 'lowp',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        sectionRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        let GLTFLoader: any;

        import('three/examples/jsm/loaders/GLTFLoader.js').then((module) => {
            GLTFLoader = module.GLTFLoader;

            const preloadModel = new Promise<void>((resolve) => {
                const loader = new GLTFLoader();
                loader.load(
                    'https://buzzvel.fra1.cdn.digitaloceanspaces.com/model.glb',
                    (gltf: { scene: any; }) => {
                        const model = gltf.scene;
                        model.position.set(-0.01, -0.01, 4.96);
                        model.rotation.set(-0.5, 0.69, 0.45);
                        modelRef.current = model;

                        ScrollTrigger.create({
                            trigger: '#primary',
                            start: '100px top',
                            onEnter: () => {
                                if (videoRef.current) videoRef.current.play();
                            },
                        });

                        const texture = new THREE.VideoTexture(videoRef.current!);
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.y = -1;
                        texture.needsUpdate = true;

                        const basic = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
                        model.traverse((object: { isMesh: any; material: THREE.MeshBasicMaterial; }) => {
                            if (object.isMesh) object.material = basic;
                        });

                        model.children[0].material = new THREE.MeshBasicMaterial({
                            color: 0x131313,
                            toneMapped: false,
                        });
                        model.children[2].material = new THREE.MeshBasicMaterial({
                            toneMapped: false,
                        });
                        model.children[2].material.map = texture;

                        scene.add(model);
                        resolve();
                    }
                );
            });

            const promise = Promise.all([preloadModel]).then(() => {
                setupResize();
                renderLoop();
                scrollAnim();
                loadAnim();
            });
        });

        function scrollAnim() {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.phone-section',
                    refreshPriority: 2,
                    start: '200px top',
                    end: '+=400',
                    scrub: 1,
                },
                defaults: {
                    duration: 1.5,
                },
            });

            tl.to(modelRef.current!.rotation, {
                x: 0,
                y: 0,
                z: 0,
            });

            tl.to(
                modelRef.current!.position,
                {
                    x: 0,
                    y: 0,
                    z: 4.9,
                },
                '<'
            );
        }

        function loadAnim() {
            if (window.scrollY < 10) {
                ScrollTrigger.refresh();

                const tl = gsap.timeline({
                    defaults: {
                        duration: 1.4,
                    },
                });

                tl.from(modelRef.current!.rotation, {
                    x: -4,
                    y: 0,
                    z: 2,
                });

                tl.from(
                    modelRef.current!.position,
                    {
                        x: 0,
                        y: -0.5,
                        z: 4.95,
                    },
                    '<'
                );
            }
        }

        function setupResize() {
            ScrollTrigger.addEventListener('refreshInit', () => {
                const newWidth = window.innerWidth;
                const newHeight = window.innerHeight;
                renderer.setSize(newWidth, newHeight);
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
            });
        }

        function renderLoop() {
            gsap.ticker.add(() => {
                if (rendererRef.current) rendererRef.current.render(scene, camera);
            });
        }

        return () => {
            gsap.ticker.remove(renderLoop);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (sectionRef.current) sectionRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, []);

    return (
        <section className="hero-section">
            <section className="phone-container">
                <section className="phone-section" ref={sectionRef}></section>
            </section>
            <video
                id="video"
                ref={videoRef}
                loop
                playsInline
                autoPlay
                muted
                crossOrigin="anonymous"
                className="hidden-video"
            >
                <source src="https://buzzvel.fra1.cdn.digitaloceanspaces.com/hero.mov" type="video/mp4" />
            </video>
        </section>
    );
};

export default ThreeSection;