"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <FullScreenLoader />}

      <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 text-white relative z-10">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Smart Bookmark
        </h1>

        <p className="text-gray-300 mb-12 max-w-md">
          Organize your links beautifully. Secure. Real-time. Modern.
        </p>

        <div className="relative group">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="relative z-10 w-[260px] h-[70px] bg-white text-gray-800 font-semibold tracking-wide border-2 border-white transition-all duration-300 group-hover:w-[210px] group-hover:bg-transparent group-hover:text-blue-500 group-hover:border-blue-500 flex items-center justify-center gap-3 rounded-lg disabled:opacity-50"
          >
            <img src="/Google.png" alt="Google" className="w-7 h-7" />
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </>
  );
}

/* 🔥 Loader */
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0b1120]/90 backdrop-blur-md z-50">
      <div className="flex gap-2 text-4xl font-bold">
        {"LOADING".split("").map((letter, index) => (
          <span
            key={index}
            className="animate-loadingWave bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
