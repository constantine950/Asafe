import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import type { Post } from "../types/type";

export default function FeedPage() {
  const posts = useLiveQuery(() =>
    db.posts.orderBy("createdAt").reverse().toArray()
  );

  const [content, setContent] = useState("");

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await db.posts.add({
      content,
      createdAt: Date.now(),
      synced: false,
    });

    setContent("");
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-emerald-700">Àṣàfé Feed</h1>
          <a href="/" className="text-sm text-emerald-600 hover:underline">
            ← Home
          </a>
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
          <p className="text-center text-gray-400">Loading posts...</p>
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
              <p className="text-gray-800">{post.content}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span>{new Date(post.createdAt).toLocaleString()}</span>
                {!post.synced && (
                  <span className="text-amber-600">Offline</span>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
