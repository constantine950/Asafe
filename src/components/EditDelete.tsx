import type { EditDeleteProp } from "../types/type";

export default function EditDelete({
  synced,
  deleted,
  id,
  userid,
  user_id,
  localUserId,
  editingId,
  startEditing,
  handleDelete,
  post,
}: EditDeleteProp) {
  return (
    <div className="flex items-center gap-3">
      {!synced && (
        <span className="text-amber-600">
          {deleted ? "🔄️ Pending delete…" : "⏳ Pending"}
        </span>
      )}

      {/* Edit/Delete only if owner (online OR offline) */}
      {(userid === user_id || localUserId === user_id) &&
        editingId !== id &&
        !deleted && (
          <div className="flex gap-2">
            <button
              onClick={() => startEditing(post)}
              className="text-emerald-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(id!)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
    </div>
  );
}
