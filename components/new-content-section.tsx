'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NewContentSection = () => {
    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".title-container",
                start: "top top",
                end: "+=500",
                scrub: 1,
                markers: false,
                pin: true,
            },
        });

        gsap.set(['.title-2', '.title-3'], { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });
        gsap.set('.title-2', { y: 400 });
        // Note: .title-3 is not present in the HTML, so this set is skipped in animation

        tl.to('.title-2', { duration: 0.5, opacity: 1, scale: 1, y: 0 })
            .to('.title-3', { duration: 0.5, opacity: 1, scale: 1, y: 0 }, "-=0.2");

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (

        <div style={{ alignItems: "center" }} className="title-container">
            <h1 style={{ fontSize: "50px", width: "70%", margin: "auto", textAlign: "center" }} className="title title-2 fade-scale">
                Step into the future with ZRIKA
                <p style={{ fontSize: "23px" }}>We bridge the gap between your financial goals and innovative tools, delivering smart solutions for a seamless banking experience.</p>
            </h1>

        </div>

    );
};

export default NewContentSection;