"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, useReducedMotion } from "motion/react";
import React, { memo } from "react";

const glyphs = [
    "က", "ခ", "ဂ", "ဃ", "င",
    "စ", "ဆ", "ဇ", "ဈ", "ည",
    "ဋ", "ဌ", "ဍ", "ဎ", "ဏ",
    "တ", "ထ", "ဒ", "ဓ", "န",
    "ပ", "ဖ", "ဗ", "ဘ", "မ",
    "ယ", "ရ", "လ", "ဝ", "သ",
    "ဟ", "ဠ", "အ",
    "ဣ", "ဤ", "ဥ", "ဦ", "ဧ",
    "ဩ", "ဪ", "၌", "၍", "၎", "၏",
    
    "人", "大", "小", "上", "下",
    "中", "口", "日", "月", "火",
    "水", "木", "土", "金", "山",
    "川", "手", "目", "耳", "足",
    "心", "力", "刀", "車", "馬",
    "魚", "鳥", "虫", "草", "花",
    "風", "雨", "雪", "天", "地",
    "東", "西", "南", "北", "左",
    "右", "前", "後", "内", "外",
    "古", "今", "新", "旧", "高",
    "低", "長", "短", "広", "狭",
    "多", "少", "早", "晩", "春",
    "夏", "秋", "冬", "年", "月",
    "日", "時", "分", "秒", "週"
];

const glyphColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
];

type DecoderTextProps = {
    text: string;
    className?: string;
    delay?: number;
};

type OutputChar = { type: "glyph" | "value"; value: string };

export function TextDecoder({ text, className = "", delay = 0 }: DecoderTextProps) {
    const output = useRef<OutputChar[]>([]);
    const container = useRef<HTMLSpanElement>(null);
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const content = text.split("");

        const shuffle = (content: string[], output: OutputChar[], position: number): OutputChar[] => {
            return content.map((value, index) => {
                if (index < position) {
                    return { type: "value", value };
                }
                if (position % 1 < 0.5) {
                    const rand = Math.floor(Math.random() * glyphs.length);
                    return { type: "glyph", value: glyphs[rand] };
                }
                return { type: "glyph", value: output[index]?.value || "" };
            });
        };

        const renderOutput = () => {
            if (!container.current) return;
            
            const allResolved = output.current.every(item => item.type === "value");
            if (allResolved && !isComplete) {
                setIsComplete(true);
                return;
            }
            
            const characterMap = output.current.map((item) => {
                if (item.type === "glyph") {
                    const randomColor = glyphColors[Math.floor(Math.random() * glyphColors.length)];
                    return `<span style="opacity:0.6; color:${randomColor};">${item.value}</span>`;
                } else {
                    return `<span class="gradient-dance font-semibold">${item.value}</span>`;
                }
            });
            container.current.innerHTML = characterMap.join("");
        };

        const unsubscribeSpring = decoderSpring.on("change", (value) => {
            output.current = shuffle(content, output.current, value);
            renderOutput();
        });

        const startSpring = async () => {
            if (delay) await new Promise((res) => setTimeout(res, delay));
            decoderSpring.set(content.length);
        };

        if (!reduceMotion) {
            startSpring();
        } else {
            output.current = content.map((value) => ({ type: "value" as const, value }));
            renderOutput();
        }

        return () => {
            unsubscribeSpring?.();
        };
    }, [decoderSpring, reduceMotion, delay, text, isComplete]);

    if (isComplete) {
        return (
            <span className={className}>
                <AuroraText className="font-semibold">
                    {text}
                </AuroraText>
            </span>
        );
    }

    return (
        <span className={className}>
            <span aria-hidden ref={container} />
        </span>
    );
}

interface AuroraTextProps {
    children: React.ReactNode;
    className?: string;
    colors?: string[];
    speed?: number;
}

const AuroraText = memo(
    ({
        children,
        className = "",
        colors = ["#22c55e", "#6366f1", "#3b82f6", "#06b6d4", "#a78bfa", "#ec4899", "#fbbf24", "#ef4444", "#8b5cf6"],
        speed = 1,
    }: AuroraTextProps) => {
        const gradientStyle = {
            backgroundImage: `linear-gradient(50deg, ${colors.join(", ")})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundSize: "200% 200%",
            backgroundPosition: "50% 25%",
            animationDuration: `${10 / speed}s`,
        };

        return (
            <span className={`relative inline-block ${className}`}>
                <span className="sr-only">{children}</span>
                <span
                    className="relative animate-gradient-dance bg-clip-text text-transparent"
                    style={gradientStyle}
                    aria-hidden="true"
                >
                    {children}
                </span>
            </span>
        );
    },
);

AuroraText.displayName = "AuroraText";