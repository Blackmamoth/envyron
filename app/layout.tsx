import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ReactQueryProvider } from "@/lib/provider/react-query"

export const metadata: Metadata = {
  title: "Envyron - Standardize your environment",
  description: "Create reusable environment templates and generate code snippets instantly.",
  generator: "v0.app",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
