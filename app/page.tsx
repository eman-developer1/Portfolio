import React from 'react';
import { Navbar } from '@/components/Navbar/Navbar';
import { Hero } from '@/components/Hero/Hero';
import { About } from '@/components/About/About';
import { Skills } from '@/components/Skills/Skills';
import { Projects } from '@/components/Projects/Projects';
import { Assignments } from '@/components/Assignments/Assignments';
import { Services } from '@/components/Services/Services';
import { Certificates } from '@/components/Certificates/Certificates';
import { LearningJourney } from '@/components/LearningJourney/LearningJourney';
import { Contact } from '@/components/Contact/Contact';
import { Footer } from '@/components/Footer/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Assignments />
        <Services />
        <Certificates />
        <LearningJourney />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
