"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}: {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
    }) => {
    const [scope, animate] = useAnimate();
    const charsArray = Array.from(words);
    useEffect(() => {
        animate(
        "span",
        {
            opacity: 1,
            filter: filter ? "blur(0px)" : "none",
        },
        {
            duration: duration ? duration : 1,
            delay: stagger(0.04),
        }
        );
    }, [animate, duration, filter]);

    const renderChars = () => {
        return (
        <motion.div ref={scope}>
            {charsArray.map((char, idx) => {
            return (
                <motion.span
                key={char + idx}
                className="dark:text-gray-500 text-black opacity-0"
                style={{
                    filter: filter ? "blur(10px)" : "none",
                }}
                >
                {char === " " ? "\u00A0" : char}
                </motion.span>
            );
            })}
        </motion.div>
        );
    };

    return (
        <div className={cn("font-bold", className)}>
        <div className="mt-4">
            <div className=" dark:text-gray-500 text-black text-xl md:text-2xl lg:text-3xl leading-snug tracking-wide">
            {renderChars()}
            </div>
        </div>
        </div>
    );
}; 