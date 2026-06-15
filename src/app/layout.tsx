import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
    title: "John Sebastian Solon - Portfolio",
    description: "Software and Firmware Engineer with hands-on experience in real-time systems, firmware, sensor fusion, machine learning, and full-stack development",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Decide the boot intro before first paint (no flash for returning / reduced-motion visitors). */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var p=sessionStorage.getItem('introPlayed');var f=location.search.indexOf('intro=play')>-1;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;document.documentElement.classList.add((f||(!p&&!r))?'intro-on':'intro-off');}catch(e){document.documentElement.classList.add('intro-off');}})();`,
                    }}
                />
            </head>
            <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
