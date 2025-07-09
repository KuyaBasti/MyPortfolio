"use client";

import { useState, useEffect } from "react";

const sections = ['about', 'projects', 'work', 'skills', 'contact'];

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState<string>('about');

    useEffect(() => {
        const sectionElements = new Map();

        // Find all section elements
        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (element) {
                sectionElements.set(sectionId, element);
            }
        });

        // Track which sections are currently intersecting
        const intersectingSections = new Set<string>();

        // Create intersection observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const sectionId = entry.target.id;
                    
                    if (entry.isIntersecting) {
                        intersectingSections.add(sectionId);
                    } else {
                        intersectingSections.delete(sectionId);
                    }
                });

                // Determine active section based on intersecting sections
                if (intersectingSections.size > 0) {
                    // Get the first intersecting section in our sections order
                    const activeId = sections.find(id => intersectingSections.has(id));
                    if (activeId) {
                        setActiveSection(activeId);
                    }
                }
            },
            {
                // Trigger when section is 30% visible
                threshold: 0.3,
                // Start observing 100px before the section enters viewport
                rootMargin: '-100px 0px -100px 0px'
            }
        );

        // Observe all sections
        sectionElements.forEach(element => {
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return activeSection;
}