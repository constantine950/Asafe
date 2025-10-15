import type { Post } from "../types/type";

export default function UserHeader({ image_url, username, user_email }: Post) {
  return (
    <div className="flex items-center gap-3 mb-2">
      {image_url ? (
        <img
          src={image_url}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      )}
      <span className="text-sm font-medium text-gray-700">
        {username || user_email}
      </span>
    </div>
  );
}
