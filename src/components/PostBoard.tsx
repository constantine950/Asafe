import { useState } from "react";
import { db } from "../db";
import { usePosts } from "../hooks/usePosts";
import { useSync } from "../hooks/useSync";

export default function PostBoard() {
  const posts = usePosts();
  const syncStatus = useSync();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addPost = async () => {
    if (!title.trim() || !content.trim()) return;
    await db.posts.add({
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
    });
    setTitle("");
    setContent("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Àṣàfé — Local Board</h1>
        <span
          className={`text-sm px-2 py-1 rounded ${
            navigator.onLine
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {navigator.onLine ? "Online" : "Offline"} ({syncStatus})
        </span>
      </header>

      {/* New Post */}
      <div className="mb-6 space-y-2">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-3 py-2"
          placeholder="Write something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={addPost}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Post
        </button>
      </div>

      {/* Posts */}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="bg-white shadow rounded p-4 border">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
              {!post.synced && " • unsynced"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
