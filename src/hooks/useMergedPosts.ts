import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { supabase } from "../lib/supabase";
import type { Post } from "../types/type";

export function useMergedPosts() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Watch network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Dexie (all posts)
  const localPosts =
    useLiveQuery(() => db.posts.orderBy("createdAt").reverse().toArray(), []) ??
    [];

  // Supabase (cloud posts)
  const [cloudPosts, setCloudPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!isOnline) return; // don’t fetch if offline

    const fetchCloudPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, content, created_at, user_id, user_email, image_url, username"
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCloudPosts(
          data.map((p) => ({
            id: p.id,
            content: p.content,
            createdAt: new Date(p.created_at).getTime(),
            synced: true,
            user_id: p.user_id,
            user_email: p.user_email ?? "Anonymous", // ✅ map email
            image_url: p.image_url,
            username: p.username,
          }))
        );
      }
    };

    fetchCloudPosts();

    // Realtime
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        fetchCloudPosts
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOnline]);

  // Merge logic
  let merged: Post[];
  if (isOnline) {
    const unsyncedLocal = localPosts.filter((p) => !p.synced);
    merged = [...unsyncedLocal, ...cloudPosts];
  } else {
    // Offline → show *all* Dexie posts (synced + unsynced)
    merged = localPosts;
  }

  return merged.sort((a, b) => b.createdAt - a.createdAt);
}
