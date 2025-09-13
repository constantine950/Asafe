import { db } from "./db";
import { supabase } from "./lib/supabase";
import { type Post } from "./types/type";

async function pushToServer(post: Post) {
  const { error } = await supabase.from("posts").insert([
    {
      content: post.content,
      created_at: new Date(post.createdAt).toISOString(),
      user_id: post.user_id,
      user_email: post.user_email,
    },
  ]);

  if (error) {
    console.error("❌ Sync failed:", error.message);
    return false;
  }
  return true;
}

export async function syncPosts() {
  const unsynced = await db.posts.filter((p) => !p.synced).toArray();
  for (const post of unsynced) {
    const success = await pushToServer(post);
    if (success) {
      await db.posts.update(post.id!, { synced: true });
    }
  }
}
