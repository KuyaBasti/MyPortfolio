"use client";

import { TextDecoder } from "@/components/ui/TextDecoder";
import { TextSlider } from "@/components/ui/TextSlider";
import { MagicButton } from "@/components/ui/Button";
import { TextGenerateEffect } from "@/components/ui/TextGenerate";
import { motion } from "motion/react";

const specialties = [
    "Real-time Systems",
    "Firmware Development",
    "Sensor Fusion",
    "Machine Learning",
    "Robotics",
    "Embedded Systems",
    "Full-Stack Development",
    "Artificial Intelligence",
    "Computer Vision",
    "Databases"
];

export default function AboutHero() {
    const handleViewWork = () => {
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 relative overflow-hidden transition-colors duration-300">
            <div className="w-full max-w-7xl text-center space-y-12 relative z-10">
                {/* Main Heading */}
                <div className="space-y-8 mb-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight select-none">
                        <TextDecoder text="John Sebastian Solon" />
                    </h1>
                    {/* Triangular Layout */}
                    <div className="flex flex-col items-center mt-12 space-y-6">
                        {/* Level 2 */}
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl select-none">
                            <TextSlider 
                                roles={["Embedded/Software Engineer"]} 
                                startupOnly={true} 
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                            />
                        </div>
                        
                        {/* Level 3: Cycling Specialties */}
                        <div className="flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-2 select-none">
                            <TextSlider 
                                roles={specialties} 
                                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
                            />
                        </div>
                        
                        {/* Level 4: Education */}
                        <TextGenerateEffect 
                            words="CSE @ UC Davis" 
                            className="font-light mb-0 select-none text-base sm:text-lg md:text-xl lg:text-2xl" 
                            filter={true}
                            duration={1}
                        />
                    </div>
                </div>

                {/* Level 5: CTA Button with Animation */}
                <motion.div 
                    className="pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.8, 
                        delay: 1,
                        ease: [0.21, 1.11, 0.81, 0.99]
                    }}
                >
                    <MagicButton
                        title="View My Work"
                        icon={<span className="text-sm">→</span>}
                        position="right"
                        otherClasses="w-auto"
                        handleClick={handleViewWork}
                    />
                </motion.div>
            </div>
        </section>
    );
}