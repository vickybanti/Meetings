import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import "react-datepicker/dist/react-datepicker.css";

import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoom App",
  description: "Video calling app",
  icons:{
    icon:'/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider appearance={{
        layout:{
          logoImageUrl:'/icons/yoom-logo.svg',
          socialButtonsVariant:"iconButton"
        },
        variables:{
          colorText:"white",
          colorPrimary:"#0E78F9",
          colorTextSecondary:"white",
          colorBackground:"#1C1F2E",
          colorInputBackground:"#252a41",
          colorInputText:"#fff",
        }
      }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#161925] antialiased`}
      >
        {children}
        <Toaster />

      </body>
      </ClerkProvider>
    </html>
  );
}
