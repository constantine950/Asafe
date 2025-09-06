import Dexie, { type Table } from "dexie";
import { type Post } from "./types/type";

export class AsafeDB extends Dexie {
  posts!: Table<Post>;

  constructor() {
    super("AsafeDB");
    this.version(2).stores({
      posts: "++id, createdAt, updatedAt, synced", // 👈 added `synced` as an index
    });
  }
}

export const db = new AsafeDB();
