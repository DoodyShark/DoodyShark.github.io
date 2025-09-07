import "./globals.css"; 
import { Providers } from "@/components/Providers" 
import type { Metadata } from "next"; 
import ThemeToggle from "@/components/ThemeToggle" 

export const metadata: Metadata = { 
  title: "My Portfolio", 
  description: "Personal site", 
}; 

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return ( 
  <html lang="en" suppressHydrationWarning> 
    <body> 
      <Providers> 
        <main className="min-h-screen flex flex-col items-center justify-center relative"> 
          {/* Language and Theme toggle */} 
          <div className="absolute top-4 right-6 flex items-center space-x-3"> 
            <div className="cursor-pointer text-lg">🌐</div> 
            <ThemeToggle /> 
          </div> 
          
          {children} 
        
        </main> 
      </Providers> 
    </body> 
  </html> ) 
}