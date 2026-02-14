import "./globals.css";
import AnimatedBackground from "./components/AnimatedBackground";

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
      <body className="relative min-h-screen text-white overflow-hidden">
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
