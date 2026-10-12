"use client";

import Film from "@/components/chapters/Film";
import TopBar from "@/components/chapters/TopBar";
import Hero from "@/components/chapters/Hero";
import Experience from "@/components/chapters/Experience";
import Projects from "@/components/chapters/Projects";
import Origin from "@/components/chapters/Origin";
import Skills from "@/components/new/Skills";
import Footer from "@/components/new/Footer";

export default function Home() {
    return (
        <>
            <Film />
            <TopBar />
            <Hero />
            <Experience />
            <Projects />
            <Origin />
            <Skills />
            <Footer />
        </>
    );
}
