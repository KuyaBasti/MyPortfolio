"use client";

import Backdrop from "@/components/Backdrop";
import Navbar from "@/components/new/Navbar";
import Hero from "@/components/new/Hero";
import Experience from "@/components/new/Experience";
import Projects from "@/components/new/Projects";

export default function Home() {
    return (
        <>
            <Backdrop />
            <Navbar />
            <Hero />
            <Experience />
            <Projects />
        </>
    );
}
