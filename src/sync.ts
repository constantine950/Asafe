import { db } from "./db";
import { type Post } from "./types/type";

// Example: replace with Supabase or CouchDB API
async function pushToServer(post: Post) {
  const res = await fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return res.ok;
}

export async function syncPosts() {
  const unsynced = await db.posts.filter((p) => !p.synced).toArray(); // 👈 works with boolean
  for (const post of unsynced) {
    const success = await pushToServer(post);
    if (success) {
      await db.posts.update(post.id!, { synced: true });
    }
  }
}
