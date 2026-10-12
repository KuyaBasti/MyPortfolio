import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Tagalog } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-inter",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-jetbrains",
    display: "swap",
});

// Baybayin for the name in the Origin section; no system ships it reliably.
const notoTagalog = Noto_Sans_Tagalog({
    subsets: ["tagalog"],
    weight: "400",
    variable: "--font-baybayin",
    display: "swap",
});

export const metadata: Metadata = {
    title: "John Sebastian Solon - Portfolio",
    description: "Software and Firmware Engineer with hands-on experience in real-time systems, firmware, autonomous robotics, machine learning, and full-stack development",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoTagalog.variable} antialiased`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
