import type { PropValues } from "../types/type";

export default function PostForm({ addPost, content, setContent }: PropValues) {
  return (
    <section className="max-w-3xl mx-auto w-full px-4 py-6">
      <form
        onSubmit={addPost}
        className="bg-white shadow rounded-xl p-4 flex flex-col gap-3"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with your community..."
          className="w-full border rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
          rows={3}
        />
        <button
          type="submit"
          className="self-end px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Post
        </button>
      </form>
    </section>
  );
}
