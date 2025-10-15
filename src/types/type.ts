export interface Post {
  id?: string;
  title?: string;
  content?: string;
  createdAt?: number;
  updatedAt?: number;
  synced?: boolean;
  deleted?: boolean;
  user_id?: string;
  user_email?: string;
  image_url?: string;
  username?: string;
}

export interface EditPostProp {
  editContent: string;
  setEditContent: (value: React.SetStateAction<string>) => void;
  handleSaveEdit: (id: string) => void;
  setEditingId: (value: React.SetStateAction<string>) => void;
  id: string;
}

export interface PropValues {
  addPost: (e: React.FormEvent) => Promise<void>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export interface EditDeleteProp {
  synced: boolean | undefined;
  deleted: boolean | undefined;
  id: string | undefined;
  userid: string | undefined;
  user_id: string | undefined;
  localUserId: string | null;
  editingId: string;
  startEditing: (post: Post) => void;
  handleDelete: (id: string) => void;
  post: Post;
}

export type TimeAgoProps = {
  timestamp: number; // ms since epoch
};

export interface CurrentUser {
  id: string;
  email: string;
  image_url: string;
  username: string;
}
