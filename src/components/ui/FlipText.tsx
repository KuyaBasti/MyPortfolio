"use client";

import { AnimatePresence, motion, Variants, MotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { ElementType } from "react";
import React from "react";

interface FlipTextProps extends MotionProps {
    /** The duration of the animation */
    duration?: number;
    /** The delay between each character */
    delayMultiple?: number;
    /** The variants of the animation */
    framerProps?: Variants;
    /** The class name of the component */
    className?: string;
    /** The element type of the component */
    as?: ElementType;
    /** The children of the component */
    children: React.ReactNode;
    /** The variants of the animation */
    variants?: Variants;
    /** Whether to trigger the animation */
    trigger?: boolean;
}

const defaultVariants: Variants = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
};

export function FlipText({
    children,
    duration = 0.5,
    delayMultiple = 0.08,
    className,
    as: Component = "span",
    variants,
    trigger = true,
    ...props
}: FlipTextProps) {
    const MotionComponent = motion.create(Component);
    const characters = React.Children.toArray(children).join("").split("");

    return (
        <div className="flex justify-center">
        <AnimatePresence mode="wait">
            {characters.map((char, i) => (
            <MotionComponent
                key={`${char}-${i}`}
                initial="hidden"
                animate={trigger ? "visible" : "hidden"}
                variants={variants || defaultVariants}
                transition={{ duration, delay: i * delayMultiple }}
                className={cn("origin-center drop-shadow-sm", className)}
                {...props}
            >
                {char === " " ? "\u00A0" : char}
            </MotionComponent>
            ))}
        </AnimatePresence>
        </div>
    );
}