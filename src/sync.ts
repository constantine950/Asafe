import { db } from "./db";
import { supabase } from "./lib/supabase";
import type { Post } from "./types/type";

async function pushToServer(post: Post) {
  if (post.deleted) {
    // 🔥 Handle delete
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("user_id", post.user_id);

    if (error) {
      console.error("❌ Delete failed:", error.message);
      return false;
    }

    // after successful delete, remove from Dexie
    await db.posts.delete(post.id!);
    return true;
  }

  // check if post already exists in Supabase
  const { data: existingPost, error: selectError } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", post.user_id) // ✅ compare by post.id, not user_id
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("❌ Failed to check existing post:", selectError.message);
    return false;
  }

  if (existingPost) {
    // update
    const { error } = await supabase
      .from("posts")
      .update({ content: post.content })
      .eq("user_id", post.user_id);

    if (error) {
      console.error("❌ Update failed:", error.message);
      return false;
    }
  } else {
    // insert
    const { error } = await supabase.from("posts").insert([
      {
        content: post.content,
        created_at: new Date(post.createdAt).toISOString(),
        user_id: post.user_id,
        user_email: post.user_email,
        image_url: post.image_url,
        username: post.username,
      },
    ]);

    if (error) {
      console.error("❌ Insert failed:", error.message);
      return false;
    }
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
