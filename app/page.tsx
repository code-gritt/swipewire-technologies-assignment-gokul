'use client';

import { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import ClientWrapper from '@/components/client-wrapper';

gsap.registerPlugin(ScrollTrigger);

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const textElements = gsap.utils.toArray(`.${styles.text}`);

    textElements.forEach((text: Element | unknown) => {
      if (text instanceof Element) {
        gsap.to(text, {
          backgroundSize: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: text,
            start: 'center 80%',
            end: 'center 20%',
            scrub: true,
          },
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <Head>
        <title>Scroll Text Animation</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <ClientWrapper>
        <div className={styles.container} ref={containerRef}>
          <h1 className={styles.text}>
            Experience Effortless Banking at Your Fingertips
          </h1>
        </div>

      </ClientWrapper>

    </>
  );
};

export default Home;