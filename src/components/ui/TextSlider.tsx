"use client";

import { useEffect, useState, useRef } from "react";

interface TextSliderProps {
    roles: string[];
    interval?: number;
    className?: string;
    startupOnly?: boolean;
}

export function TextSlider({ 
    roles, 
    interval = 5000, 
    className = "", 
    startupOnly = false
}: TextSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initial reveal animation
        const revealTimer = setTimeout(() => {
            setIsVisible(true);
            setIsAnimating(false);
        }, 500); // Match the overlay animation duration
    
        // Setup cycling if not startupOnly
        if (!startupOnly && roles.length > 1) {
            intervalRef.current = setInterval(() => {
                // Step 1: Hide text completely (fade out + slide down)
                setIsVisible(false);
                
                // Step 2: After fade-out is complete, change word and start overlay
                setTimeout(() => {
                    setCurrentIndex((prev) => (prev + 1) % roles.length);
                    setIsAnimating(true);
                }, 400); // Wait for fade-out transition to complete
                
                // Step 3: End the slide animation and reveal text (slide up + fade in)
                setTimeout(() => {
                    setIsAnimating(false);
                    setIsVisible(true);
                }, 1500); // 500ms fade-out + 1000ms overlay animation
                
            }, interval);
        }
    
        return () => {
            clearTimeout(revealTimer);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [roles.length, interval, startupOnly]);

    if (roles.length === 0) return null;

    const currentRole = roles[currentIndex];

    return (
        <div className={`relative inline-flex items-center ${className}`}>
            <div className="relative pb-2 flex items-center overflow-hidden">
                {/* Text content with slide-up animation + opacity */}
                <span 
                    className={`
                        inline-block relative font-['Fira_Code']
                        transition-all duration-500 ease-out text-gray-600 dark:text-gray-300
                        ${isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-[75px]'
                        }
                    `}
                >
                    {currentRole}
                </span>
                
                {/* Sliding overlay - covers text */}
                <span 
                    className={`
                        absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 z-10
                        transition-transform duration-1000 ease-out
                        ${isAnimating 
                            ? 'transform scale-x-100 origin-left' 
                            : 'transform scale-x-0 origin-right'
                        }
                    `}
                />
            </div>
        </div>
    );
}