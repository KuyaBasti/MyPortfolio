"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, MotionValue, useTransform, useSpring } from "motion/react";
import React, { useRef, useState, useEffect } from "react";
import { FlipText } from "./FlipText";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
    visible?: boolean;
    activeSection?: string;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 100) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-4 z-50 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    const [width, setWidth] = useState("100%");

    useEffect(() => {
        function updateWidth() {
            const vw = window.innerWidth;
            if (!visible) {
                setWidth("100%");
            } else if (vw <= 640) {
                setWidth("95%");
            } else if (vw <= 1400) {
                setWidth("85%");
            } else if (vw <= 1920) {
                setWidth("70%");
            } else {
                setWidth("60%");
            }
        }
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, [visible]);

    return (
        <motion.div
            animate={{
                width,
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                y: visible ? 0 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-[60] mx-auto hidden flex-row items-center self-start rounded-full bg-transparent lg:flex dark:bg-transparent px-6 py-3 lg:px-8 lg:py-4 xl:px-12 xl:py-5 justify-between",
                visible && "bg-white/80 dark:bg-neutral-950/80",
                className,
            )}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child) && typeof child.type !== "string"
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick, visible, activeSection }: NavItemsProps) => {
    const mouseX = useMotionValue(Infinity);
    const [isNavbarHovered, setIsNavbarHovered] = useState(false);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseEnter={() => setIsNavbarHovered(true)}
            onMouseLeave={() => {
                mouseX.set(Infinity);
                setIsNavbarHovered(false);
            }}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 font-medium text-zinc-600 transition-all duration-300 hover:text-zinc-800 lg:flex lg:space-x-2",
                visible ? "text-xl" : "text-2xl",
                className,
            )}
        >
            {items.map((item, idx) => (
                <NavItem
                    key={`link-${idx}`}
                    item={item}
                    mouseX={mouseX}
                    onItemClick={onItemClick}
                    activeSection={activeSection}
                    isNavbarHovered={isNavbarHovered}
                />
            ))}
        </motion.div>
    );
};

const NavItem = ({ 
    item, 
    mouseX, 
    onItemClick, 
    activeSection,
    isNavbarHovered 
}: {
    item: { name: string; link: string };
    mouseX: MotionValue<number>;
    onItemClick?: () => void;
    activeSection?: string;
    isNavbarHovered: boolean;
}) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [isItemHovered, setIsItemHovered] = useState(false);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const scaleTransform = useTransform(distance, [-100, 0, 100], [1, 1.4, 1]);
    const scale = useSpring(scaleTransform, {
        mass: 0.1,
        stiffness: 150,
        damping: 12,
    });

    const sectionId = item.link.substring(1);
    const isActive = activeSection === sectionId;

    return (
        <motion.a
            ref={ref}
            onClick={onItemClick}
            onMouseEnter={() => setIsItemHovered(true)}
            onMouseLeave={() => setIsItemHovered(false)}
            className={cn(
                "relative px-5 py-3 transition-colors duration-300 cursor-pointer",
                isActive 
                    ? "text-blue-600 dark:text-blue-400 font-semibold" 
                    : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100"
            )}
            href={item.link}
            style={{ scale }}
        >
            {/* DEFAULT: Original blue tall pill */}
            {isActive && !isNavbarHovered && (
                <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 h-full w-full rounded-full bg-blue-100/50 dark:bg-blue-900/30"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            )}
            
            {/* HOVER: Shorter glassmorphic pill */}
            {isActive && isNavbarHovered && (
                <motion.div
                    layoutId="activeSection"
                    className="absolute inset-x-0 top-2 bottom-2 rounded-full backdrop-blur-md bg-black/20 dark:bg-white/10 border border-black/20 dark:border-white/20"
                    style={{
                        boxShadow: `
                            inset 0px -8px 24px -14px rgba(255, 255, 255, 0.74),
                            0px 6px 61px -15px rgba(255, 255, 255, 0.54),
                            0px 0px 20px rgba(59, 130, 246, 0.3)
                        `,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            )}
            
            <span className="relative z-20">
                {!isActive ? (
                    <div className={isItemHovered ? "h-[26px] overflow-hidden" : "h-[24px] overflow-hidden"}>
                        {isItemHovered ? (
                            // ENTER: FlipText animation
                            <FlipText 
                                duration={0.3} 
                                delayMultiple={0.05}
                                trigger={isItemHovered}
                                className="h-[25px] flex items-center"
                            >
                                {item.name}
                            </FlipText>
                        ) : (
                            // EXIT: Slide down animation
                            <motion.div 
                                className="flex flex-col"
                                initial={{ y: -20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <span className="h-[25px] flex items-center text-neutral-800 dark:text-neutral-100 font-medium">
                                    {item.name}
                                </span>
                                <span className="h-[25px] flex items-center text-neutral-600 dark:text-neutral-300">
                                    {item.name}
                                </span>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    // Active items show normally
                    item.name
                )}
            </span>
        </motion.a>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(10px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
                    : "none",
                width: visible ? "85%" : "100%",
                paddingRight: visible ? "16px" : "0px",
                paddingLeft: visible ? "16px" : "0px",
                borderRadius: visible ? "12px" : "2rem",
                y: visible ? 0 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-3 lg:hidden",
                visible && "bg-white/80 dark:bg-neutral-950/80",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ 
                        opacity: 0,
                        scale: 0,
                        transformOrigin: "top right"
                    }}
                    animate={{ 
                        opacity: 1,
                        scale: 1,
                        transformOrigin: "top right"
                    }}
                    exit={{ 
                        opacity: 0,
                        scale: 0,
                        transformOrigin: "top right",
                        transition: {
                            duration: 0.2,
                            ease: "easeInOut"
                        }
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut",
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                    }}
                    className={cn(
                        "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] mt-6 border-t border-neutral-300 dark:border-neutral-800",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            className={cn(
                "hamburger hamburger--squeeze",
                isOpen && "is-active"
            )}
            onClick={onClick}
            aria-label="Toggle menu"
            type="button"
        >
            <span className="hamburger-box">
                <span className={cn(
                    "hamburger-inner",
                    "bg-black dark:bg-white",
                )}></span>
            </span>
        </button>
    );
};

export const NavbarLogo = ({ 
    visible, 
    activeSection, 
    isMobile = false 
}: { 
    visible?: boolean; 
    activeSection?: string;
    isMobile?: boolean;
}) => {
    const getDisplayText = () => {
        if (isMobile && activeSection) {
            return activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
        }
        return visible ? "JS" : "John Sebastian Solon";
    };

    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 px-3 py-2 font-normal text-black w-full justify-center md:w-auto md:justify-start"
        >
            <span className={cn(
                "font-bold text-black dark:text-white transition-all duration-300",
                visible ? "text-2xl" : "text-3xl"
            )}>
                {getDisplayText()}
            </span>
        </a>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
    | React.ComponentPropsWithoutRef<"a">
    | React.ComponentPropsWithoutRef<"button">
)) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-white button text-black font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};