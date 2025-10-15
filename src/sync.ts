import { db } from "./db";
import { supabase } from "./lib/supabase";
import type { Post } from "./types/type";

async function pushToServer(post: Post) {
  if (post.deleted) {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      console.error("❌ Delete failed:", error.message);
      return false;
    }

    await db.posts.delete(post.id!);
    return true;
  }

  const { data: existingPost } = await supabase
    .from("posts")
    .select("id")
    .eq("id", post.id)
    .maybeSingle();

  if (existingPost) {
    const { error } = await supabase
      .from("posts")
      .update({
        content: post.content,
      })
      .eq("id", post.id);

    if (error) {
      console.error("❌ Update failed:", error.message);
      return false;
    }
  } else {
    const { error } = await supabase.from("posts").insert([
      {
        id: post.id,
        content: post.content,
        created_at: new Date(post.createdAt!).toISOString(),
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

  await Promise.all(
    unsynced.map(async (post) => {
      const success = await pushToServer(post);
      if (success) {
        await db.posts.update(post.id!, { synced: true });
      }
    })
  );
}
