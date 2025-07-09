"use client";

import { useState, useEffect } from "react";
import AboutHero from "@/components/AboutHero";
import About from "@/components/About";
import Work from "@/components/Work";
import Education from "@/components/Education";
import SkillsSection from "@/components/SkillSection";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import WaveGradient from "./ui/Gradient";
import { PortfolioNavbar } from "@/components/Navbar";
import { useActiveSection } from "@/hooks/useActive";

export default function Home() {
  // Initialize theme state (default to dark mode)
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Apply theme class to document root on mount and theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
        root.classList.add('dark');
        root.classList.remove('light');
        } else {
        root.classList.add('light');
        root.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Persist theme preference in localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const handleThemeToggle = (newIsDark: boolean) => {
        setIsDarkMode(newIsDark);
    };

    // Track active section based on scroll
    const activeSection = useActiveSection();

    return (
        <div className="min-h-screen transition-colors duration-300">
        {/* Portfolio Navbar */}
        <PortfolioNavbar 
            isDarkMode={isDarkMode} 
            onThemeToggle={handleThemeToggle}
            activeSection={activeSection}
        />

        <WaveGradient />
        
        {/* Main Content */}
        <section id="hero">
            <AboutHero />
        </section>

        <section id="about">
            <About />
        </section>
        
        {/* Other Sections */}
        <div className="max-w-4xl mx-auto px-4 space-y-32 pb-24">
            <Projects />

            <section id="work">
            <Work />
            </section>

            <section id="education">
            <Education />
            </section>

            <SkillsSection />

            <Contact />
        </div>
        </div>
    );
}