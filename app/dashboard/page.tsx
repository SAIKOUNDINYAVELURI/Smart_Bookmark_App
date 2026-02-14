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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  /* ==============================
     FETCH BOOKMARKS (User Scoped)
  ===============================*/
  const fetchBookmarks = async (userId: string) => {
    let query = supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setBookmarks(data);
    }
  };

  /* ==============================
     AUTH + REALTIME
  ===============================*/
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const setup = async () => {
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
          () => {
            fetchBookmarks(currentUser.id);
          },
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [router, search]); // 🔥 refetch when search changes

  /* ==============================
     ACTIONS
  ===============================*/
  const addBookmark = async () => {
    if (!title || !url || !user) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks(user.id);
  };

  const deleteBookmark = async (id: string) => {
  if (!user) return;

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // 🔥 Always scope by user

  if (error) {
    console.error(error.message);
  } else {
    fetchBookmarks(user.id);
  }
};


  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  /* ==============================
     USER INFO
  ===============================*/
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatar =
    user?.user_metadata?.avatar_url ||
    `https://ui-avatars.com/api/?name=${displayName}`;

  /* ==============================
     UI
  ===============================*/
  return (
    <main className="min-h-screen p-10 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-12 h-12 rounded-full border border-white/20 shadow-lg"
          />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Welcome, {displayName}
          </h1>
        </div>

        <button onClick={handleLogout} className="blob-btn">
          Logout
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
      </div>

      {/* Add Bookmark */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl mb-10 space-y-6">
        <h2 className="text-xl font-semibold text-purple-300">Add Bookmark</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL"
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button onClick={addBookmark} className="blob-btn">
          Add Bookmark
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-10 max-w-md">
        <input
          type="text"
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
        />
      </div>

      {/* Bookmark Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.length === 0 && (
          <p className="text-white/40">
            {search ? "No matching bookmarks." : "No bookmarks yet."}
          </p>
        )}

        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
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
              <span className="text-lg font-semibold text-blue-400 group-hover:text-blue-300 transition">
                {bookmark.title}
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition text-blue-300">
                ↗
              </span>
            </a>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="blob-btn blob-delete"
              >
                Delete
                <span className="blob-btn__inner">
                  <span className="blob-btn__blobs">
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                    <span className="blob-btn__blob"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
