import TimeAgo from "../components/TimeAgo";
import PostSkeleton from "../components/PostSkeleton";
import { useEffect, useState } from "react";
import { db } from "../db";
import type { Post } from "../types/type";
import { syncPosts } from "../sync";
import type { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { useMergedPosts } from "../lib/hooks/useMergedPosts";
import { useFetchUser } from "../lib/hooks/useFetchUser";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import PostForm from "../components/PostForm";
import UserHeader from "../components/UserHeader";
import EditPost from "../components/EditPost";
import EditDelete from "../components/EditDelete";

export default function FeedPage() {
  const posts = useMergedPosts();
  const [content, setContent] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string>("");
  const [editContent, setEditContent] = useState("");

  // Fetch online user and cache locally
  const { user, localUserId } = useFetchUser();

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
      user_id: activeUser?.id,
      user_email: activeUser?.email,
      image_url: profile?.image_url,
      username: profile?.username,
    });

    setContent("");

    if (navigator.onLine) {
      await syncPosts();
    }
  };

  // Edit handlers
  function startEditing(post: Post) {
    setEditingId(post.id!);
    setEditContent(post.content!);
  }

  async function handleSaveEdit(id: string) {
    if (!editContent.trim()) return;
    await db.posts.update(id, { content: editContent, synced: false });
    setEditingId("");
    setEditContent("");
    if (navigator.onLine) {
      await syncPosts();
    }
  }

  // Delete handler
  async function handleDelete(id: string) {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    // mark as deleted
    await db.posts.update(id, { deleted: true, synced: false });
    if (navigator.onLine) {
      await syncPosts();
    }
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
      <Header />

      {/* Post Form */}
      <PostForm addPost={addPost} setContent={setContent} content={content} />

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
              title={post.deleted ? "Post deleted" : ""}
              key={post.id}
              className="bg-white shadow rounded-xl p-4 flex flex-col"
            >
              {/* User header */}
              <UserHeader
                image_url={post.image_url}
                username={post.username}
                user_email={post.user_email}
              />

              {/* Content / Edit Mode */}
              {editingId === post.id ? (
                <EditPost
                  id={post.id}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  setEditingId={setEditingId}
                  handleSaveEdit={handleSaveEdit}
                />
              ) : (
                <p className="text-gray-800">{post.content}</p>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <TimeAgo timestamp={post.createdAt!} />

                <EditDelete
                  synced={post.synced}
                  deleted={post.deleted}
                  id={post.id}
                  localUserId={localUserId}
                  editingId={editingId}
                  post={post}
                  userid={user?.id}
                  user_id={post.user_id}
                  startEditing={startEditing}
                  handleDelete={handleDelete}
                />
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
