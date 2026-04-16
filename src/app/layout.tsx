import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const sora = Sora({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sora",
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
    description: "Embedded/Software Engineer with hands-on experience in real-time systems, firmware, sensor fusion, machine learning, and full-stack development",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${sora.variable} ${jetbrainsMono.variable} antialiased`}>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
