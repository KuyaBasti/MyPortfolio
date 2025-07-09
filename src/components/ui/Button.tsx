"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface MagicButtonProps {
    title: string;
    icon?: React.ReactNode;
    position?: "left" | "right";
    handleClick?: () => void;
    otherClasses?: string;
}

export function MagicButton({
    title,
    icon,
    position = "right",
    handleClick,
    otherClasses = ""
}: MagicButtonProps) {
    
    return (
        <button
            className={`relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none group ${otherClasses}`}
            onClick={handleClick}
        >
            {/* Spinning conic gradient border */}
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] light:bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#ef4444_50%,#000000_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            
            {/* Button content */}
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg light:bg-gray-50 dark:bg-slate-950 light:group-hover:bg-[#E2CBFF] dark:group-hover:bg-transparent transition duration-200 px-7 text-sm font-medium light:text-black light:group-hover:text-black dark:text-white backdrop-blur-3xl gap-2">
                {position === "left" && icon}
                {title}
                {position === "right" && icon}
            </span>
        </button>
    );
}

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface ToggleButtonProps {
    isDark?: boolean;
    onToggle?: (isDark: boolean) => void;
    className?: string;
    duration?: number;
    clockwise?: boolean;
}

export function ToggleButton({ 
    isDark = true, 
    onToggle, 
    className,
    duration = 1,
    clockwise = true 
}: ToggleButtonProps) {
    const [isChecked, setIsChecked] = useState(isDark);
    const [hovered, setHovered] = useState<boolean>(false);
    const [direction, setDirection] = useState<Direction>("TOP");

    const movingMap: Record<Direction, string> = {
        TOP: `radial-gradient(20.7% 50% at 50% 0%, ${isChecked ? 'hsl(0, 0%, 100%)' : 'hsl(220, 100%, 30%)'} 0%, rgba(255, 255, 255, 0) 100%)`,
        LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${isChecked ? 'hsl(0, 0%, 100%)' : 'hsl(220, 100%, 30%)'} 0%, rgba(255, 255, 255, 0) 100%)`,
        BOTTOM: `radial-gradient(20.7% 50% at 50% 100%, ${isChecked ? 'hsl(0, 0%, 100%)' : 'hsl(220, 100%, 30%)'} 0%, rgba(255, 255, 255, 0) 100%)`,
        RIGHT: `radial-gradient(16.2% 41.199999999999996% at 100% 50%, ${isChecked ? 'hsl(0, 0%, 100%)' : 'hsl(220, 100%, 30%)'} 0%, rgba(255, 255, 255, 0) 100%)`,
    };

    const highlight = isChecked 
        ? "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)"
        : "radial-gradient(75% 181.15942028985506% at 50% 50%, #1e40af 0%, rgba(0, 0, 0, 0) 100%)";

    useEffect(() => {
        if (!hovered) {
            const rotateDirection = (currentDirection: Direction): Direction => {
                const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
                const currentIndex = directions.indexOf(currentDirection);
                const nextIndex = clockwise
                    ? (currentIndex - 1 + directions.length) % directions.length
                    : (currentIndex + 1) % directions.length;
                return directions[nextIndex];
            };
            const interval = setInterval(() => {
                setDirection((prevState) => rotateDirection(prevState));
            }, duration * 1000);
            return () => clearInterval(interval);
        }
    }, [hovered, duration, clockwise]);

    useEffect(() => {
        setIsChecked(isDark);
    }, [isDark]);

    const handleToggle = () => {
        const newState = !isChecked;
        setIsChecked(newState);
        onToggle?.(newState);
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleToggle}
            className={cn(
                "relative flex rounded-full content-center hover:bg-black/5 transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-1 decoration-clone w-fit cursor-pointer",
                className
            )}
        >
            {/* Toggle Content */}
            <div className="w-auto z-10 rounded-[inherit] p-1">
                {/* Toggle Track - responsive sizing */}
                <div className={cn(
                    "relative w-[80px] md:w-[110px] h-[36px] md:h-[50px] rounded-full transition-all duration-300 shadow-sm",
                    "after:absolute after:content-[''] after:w-[28px] md:after:w-[40px] after:h-[28px] md:after:h-[40px] after:rounded-full after:top-[4px] md:after:top-[5px] after:left-[4px] md:after:left-[5px]",
                    "after:transition-all after:duration-300 after:shadow-md",
                    "active:after:w-[32px] md:active:after:w-[50px]",
                    isChecked 
                        ? "bg-zinc-500 after:bg-gradient-to-r after:from-zinc-900 after:to-zinc-900 after:left-[76px] md:after:left-[105px] after:-translate-x-full"
                        : "bg-white after:bg-gradient-to-r after:from-orange-500 after:to-yellow-400"
                )} />

                {/* Sun Icon - responsive sizing */}
                <LightModeIcon
                    sx={{ fontSize: { xs: 20, md: 24 } }}
                    className={cn(
                        "absolute left-4 md:left-5 top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none",
                        isChecked ? "text-white opacity-60" : "text-white opacity-100"
                    )}
                />

                {/* Moon Icon - responsive sizing */}
                <DarkModeIcon
                    sx={{ fontSize: { xs: 20, md: 24 } }}
                    className={cn(
                        "absolute right-4 md:right-5 top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none",
                        isChecked ? "text-white opacity-70" : "text-black opacity-60"
                    )}
                />
            </div>

            {/* Rotating Border Gradient Effect */}
            <motion.div
                className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
                style={{
                    filter: "blur(2px)",
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
                initial={{ background: movingMap[direction] }}
                animate={{
                    background: hovered
                        ? [movingMap[direction], highlight]
                        : movingMap[direction],
                }}
                transition={{ ease: "linear", duration: duration }}
            />
        </div>
    );
}