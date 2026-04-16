"use client";

import Navbar from "@/components/new/Navbar";
import Hero from "@/components/new/Hero";
import Experience from "@/components/new/Experience";
import Projects from "@/components/new/Projects";

export default function Home() {
    return (
        <div className="min-h-screen" style={{ background: "#050505" }}>
            <Navbar />
            <Hero />
            <Experience />
            <Projects />
        </div>
    );
}
