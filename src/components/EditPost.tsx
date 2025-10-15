import type { EditPostProp } from "../types/type";

export default function EditPost({
  editContent,
  setEditContent,
  handleSaveEdit,
  setEditingId,
  id,
}: EditPostProp) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full border rounded-lg px-2 py-1 resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleSaveEdit(id)}
          className="px-3 py-1 bg-emerald-600 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEditingId("")}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
