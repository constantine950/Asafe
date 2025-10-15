import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";
import { db } from "../../db";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);
  const [localUserId, setLocalUserId] = useState<string | null>(null);

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

  return { user, localUserId };
}
