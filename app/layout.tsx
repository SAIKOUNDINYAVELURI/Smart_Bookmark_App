import "./globals.css";
import VantaBackground from "./components/VantaBackground";

export const metadata = {
  title: "Smart Bookmark App",
  description: "Bookmark manager using Next.js + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-white relative overflow-hidden">
        {/* Vanta Background */}
        <VantaBackground />

        {/* Goo Filter */}
        <svg id="goo-filter">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  
                        0 1 0 0 0  
                        0 0 1 0 0  
                        0 0 0 21 -7"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {children}
      </body>
    </html>
  );
}
