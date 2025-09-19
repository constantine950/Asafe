import TimeAgo from "../components/TimeAgo";
import PostSkeleton from "../components/PostSkeleton";
import { useEffect, useState } from "react";
import { db } from "../db";
import type { Post } from "../types/type";
import { Link } from "react-router";
import { syncPosts } from "../sync";
import { useMergedPosts } from "../hooks/useMergedPosts";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

export default function FeedPage() {
  const posts = useMergedPosts();
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [localUserId, setLocalUserId] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string>("");
  const [editContent, setEditContent] = useState("");

  // Fetch online user and cache locally
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);

        const { data: prof } = await supabase
          .from("profiles")
          .select("username, image_url")
          .eq("id", data.user.id)
          .single();

        // Save in Dexie for offline use
        await db.current_user.put({
          id: data.user.id,
          email: data.user.email!,
          username: prof?.username,
          image_url: prof?.image_url,
        });
        setLocalUserId(data.user.id);
      } else {
        // If offline, try Dexie fallback
        const local = await db.current_user.toArray();
        if (local.length > 0) setLocalUserId(local[0].id);
      }
    });
  }, []);

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let activeUser: User | null = null;
    let profile: { username?: string; image_url?: string } | null = null;

    try {
      // Try online first
      const { data } = await supabase.auth.getUser();
      activeUser = data.user;

      if (activeUser) {
        // fetch profile from Supabase
        const { data: prof } = await supabase
          .from("profiles")
          .select("username, image_url")
          .eq("id", activeUser.id)
          .single();
        profile = prof;
      }
    } catch (err) {
      console.log("Offline, falling back to Dexie user:", err);
    }

    // If offline, fallback to Dexie cached user
    if (!activeUser && localUserId) {
      const cachedUser = await db.current_user.get(localUserId);
      if (cachedUser) {
        activeUser = {
          id: cachedUser.id,
          email: cachedUser.email,
        } as User;
        profile = {
          username: cachedUser.username,
          image_url: cachedUser.image_url,
        };
      }
    }

    if (!activeUser) {
      alert("⚠️ No user found. You must be logged in at least once.");
      return;
    }

    await db.posts.add({
      id: uuidv4(),
      content,
      createdAt: Date.now(),
      synced: false,
      user_id: activeUser.id,
      user_email: activeUser.email!,
      image_url: profile?.image_url,
      username: profile?.username,
    });

    setContent("");

    // Only try sync if online
    if (navigator.onLine) {
      await syncPosts();
    }
  };

  // Edit handlers
  function startEditing(post: Post) {
    setEditingId(post.id);
    setEditContent(post.content);
  }

  async function handleSaveEdit(id: string) {
    if (!editContent.trim()) return;
    await db.posts.update(id, { content: editContent, synced: false });
    setEditingId("");
    setEditContent("");
    await syncPosts();
  }

  // Delete handler
  async function handleDelete(id: string) {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    // mark as deleted
    await db.posts.update(id, { deleted: true, synced: false });
    await syncPosts();
  }

  // Auto-sync in background whenever app is online
  useEffect(() => {
    const handleOnline = () => {
      syncPosts();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-700">Àṣàfé Feed</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-emerald-600 hover:underline">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Post Form */}
      <section className="max-w-3xl mx-auto w-full px-4 py-6">
        <form
          onSubmit={addPost}
          className="bg-white shadow rounded-xl p-4 flex flex-col gap-3"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with your community..."
            className="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
            rows={3}
          />
          <button
            type="submit"
            className="self-end px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Post
          </button>
        </form>
      </section>

      {/* Posts */}
      <section className="max-w-3xl mx-auto w-full px-4 pb-20 space-y-4">
        {!posts ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">
            No posts yet. Be the first!
          </p>
        ) : (
          posts.map((post: Post) => (
            <article
              key={post.id}
              className="bg-white shadow rounded-xl p-4 flex flex-col"
            >
              {/* User header */}
              <div className="flex items-center gap-3 mb-2">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {post.username || post.user_email}
                </span>
              </div>

              {/* Content / Edit Mode */}
              {editingId === post.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border rounded-lg px-2 py-1 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(post.id!)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId("")}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800">{post.content}</p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <TimeAgo timestamp={post.createdAt} />

                <div className="flex items-center gap-3">
                  {!post.synced && (
                    <span className="text-amber-600">⏳ Pending</span>
                  )}

                  {/* Edit/Delete only if owner (online OR offline) */}
                  {(user?.id === post.user_id ||
                    localUserId === post.user_id) &&
                    editingId !== post.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(post)}
                          className="text-emerald-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id!)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
