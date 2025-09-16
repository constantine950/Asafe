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

export default function FeedPage() {
  const posts = useMergedPosts();
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, image_url")
      .eq("id", user.id)
      .single();

    await db.posts.add({
      content,
      createdAt: Date.now(),
      synced: false,
      user_id: user.id,
      user_email: user.email,
      image_url: profile?.image_url,
      username: profile?.username,
    });

    setContent("");
    await syncPosts();
  };

  function startEditing(post: Post) {
    setEditingId(post.id);
    setEditContent(post.content);
  }

  async function handleSaveEdit(id: number | undefined) {
    if (!editContent.trim()) return;
    await db.posts.update(id, { content: editContent, synced: false });
    setEditingId(undefined);
    setEditContent("");
    await syncPosts();
  }

  async function handleDelete(id: number | undefined) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await db.posts.delete(id);
    await syncPosts();
  }

  useEffect(() => {
    const handleOnline = () => syncPosts();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-700">Àṣàfé Feed</h1>
          <Link to="/" className="text-sm text-emerald-600 hover:underline">
            ← Home
          </Link>
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
              {/* Header with avatar */}
              <div className="flex items-center gap-3 mb-2">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.username || "user"}
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
                      onClick={() => handleSaveEdit(post.id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(undefined)}
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
                  {(user?.id === post.user_id && editingId !== post.id) ||
                    (!navigator.onLine && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(post)}
                          className="text-emerald-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
