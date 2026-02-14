"use client";

import { supabase } from "@/lib/supabase";

export default function Login() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
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
          className="relative z-10 w-[260px] h-[70px] bg-white text-gray-800 font-semibold tracking-wide border-2 border-white transition-all duration-300 group-hover:w-[210px] group-hover:bg-transparent group-hover:text-blue-500 group-hover:border-blue-500 flex items-center justify-center gap-3 rounded-lg"
        >
          <img src="/Google.png" alt="Google" className="w-7 h-7" />
          Continue with Google
        </button>

        <div className="absolute top-0 right-0 w-[70px] h-[70px] border-2 border-transparent rotate-45 transition-all duration-300 group-hover:border-blue-500 group-hover:right-[-75px] flex items-center justify-center">
          <svg
            viewBox="0 0 268.832 268.832"
            className="w-6 h-6 rotate-[-45deg] fill-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
          </svg>
        </div>
      </div>
    </main>
  );
}
