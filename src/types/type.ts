export interface Post {
  id?: number;
  title?: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  synced: boolean;
  user_id?: string;
  user_email?: string;
}
