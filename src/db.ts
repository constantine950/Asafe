import Dexie, { type Table } from "dexie";
import { type CurrentUser, type Post } from "./types/type";

export class AsafeDB extends Dexie {
  posts!: Table<Post, string>;
  current_user!: Table<CurrentUser, string>;

  constructor() {
    super("AsafeDB");
    this.version(2).stores({
      posts:
        "id, content, createdAt, synced, user_id, user_email, username, image_url, deleted",
      current_user: "id, email",
    });
  }
}

export const db = new AsafeDB();
