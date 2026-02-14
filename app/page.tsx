"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  const letters = ["C", "H", "E", "C", "K", "I", "N", "G"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Animated Text */}
      <div className="relative flex gap-2 text-4xl font-bold">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="animate-loadingWave opacity-0 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{
              animationDelay: `${index * 0.000001}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
