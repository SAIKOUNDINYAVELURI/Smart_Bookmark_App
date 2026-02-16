"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User, RealtimeChannel } from "@supabase/supabase-js";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const router = useRouter();

  /* ================= DEBOUNCE SEARCH ================= */

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  /* ================= FETCH ================= */

  const fetchBookmarks = async (userId: string, searchValue = "") => {
    let query = supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (searchValue) {
      query = query.ilike("title", `%${searchValue}%`);
    }

    const { data } = await query;
    if (data) setBookmarks(data);
  };

  /* ================= AUTH + INITIAL LOAD ================= */

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setup = async () => {
      setIsLoading(true);

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const currentUser = data.session.user;
      setUser(currentUser);

      await fetchBookmarks(currentUser.id);

      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${currentUser.id}`,
          },
          () => fetchBookmarks(currentUser.id, debouncedSearch),
        )
        .subscribe();

      setIsLoading(false);
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router]);

  /* ================= SEARCH EFFECT ================= */

  useEffect(() => {
    if (user) {
      fetchBookmarks(user.id, debouncedSearch);
    }
  }, [debouncedSearch]);

  /* ================= ACTIONS ================= */

  const addBookmark = async () => {
    if (!title || !url || !user) return;

    setIsSaving(true);

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");

    await fetchBookmarks(user.id, debouncedSearch);

    setIsSaving(false);
  };

  const deleteBookmark = async (id: string) => {
    if (!user) return;

    setIsActionLoading(true);

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    await fetchBookmarks(user.id, debouncedSearch);

    setIsActionLoading(false);
  };

  const handleLogout = async () => {
    setIsActionLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatar =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${displayName}`;

  /* ================= FULL PAGE LOADER ================= */

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      {isActionLoading && <FullScreenLoader />}

      <main className="min-h-screen px-4 sm:px-8 lg:px-16 py-8 text-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full border border-white/20"
            />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Welcome, {displayName}
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="blob-btn blob-delete text-sm sm:text-base"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl mb-10 space-y-5">
          <h2 className="text-lg sm:text-xl font-semibold text-purple-300">
            Add Bookmark
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Title"
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="URL"
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              disabled={isSaving}
              className="blob-btn blob-add disabled:opacity-50"
            >
              {isSaving ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.length === 0 && (
            <p className="text-white/40">
              {debouncedSearch ? "No matching bookmarks." : "No bookmarks yet."}
            </p>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:scale-105 transition"
            >
              <a
                href={
                  bookmark.url.startsWith("http")
                    ? bookmark.url
                    : `https://${bookmark.url}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center"
              >
                <span className="text-blue-400 font-semibold break-words">
                  {bookmark.title}
                </span>
                <span>↗</span>
              </a>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="blob-btn blob-delete text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

/* ================= LOADER ================= */

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
