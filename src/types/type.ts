export interface Post {
  id?: number;
  title?: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  synced: boolean;
  deleted?: boolean;
  user_id?: string;
  user_email?: string;
  image_url?: string;
  username?: string;
}

export type TimeAgoProps = {
  timestamp: number; // ms since epoch
};

export interface CurrentUser {
  id: string;
  email: string;
}
