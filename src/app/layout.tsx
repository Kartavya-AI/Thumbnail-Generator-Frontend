import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "Thumbnail Generator",
    description:
        "Generate thumbnails from prompts and save to Google Cloud Storage.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <header className="flex justify-end items-center p-4 gap-4 h-16"></header>
                    <Providers>
                        <Header />
                        {children}
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
