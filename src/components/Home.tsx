"use client";

import Backdrop from "@/components/Backdrop";
import Navbar from "@/components/new/Navbar";
import Hero from "@/components/new/Hero";
import Experience from "@/components/new/Experience";
import Projects from "@/components/new/Projects";
import About from "@/components/new/About";
import Skills from "@/components/new/Skills";
import Contact from "@/components/new/Contact";
import Footer from "@/components/new/Footer";

export default function Home() {
    return (
        <>
            <Backdrop />
            <Navbar />
            <Hero />
            <Experience />
            <Projects />
            <About />
            <Skills />
            <Contact />
            <Footer />
        </>
    );
}
