import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { type Post } from "../types/type";

export function usePosts(): Post[] {
  const posts = useLiveQuery(
    () => db.posts.orderBy("createdAt").reverse().toArray(),
    []
  );
  return posts ?? [];
}
