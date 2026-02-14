"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return null;
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
