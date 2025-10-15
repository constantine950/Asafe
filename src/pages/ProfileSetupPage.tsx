import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router";

export default function ProfileSetupPage() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const pic = `https://i.pravatar.cc/48?u=49947${Date.now()}`;

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      username,
      bio,
      image_url: pic,
    });

    if (error) return alert(error.message);

    navigate("/feed");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-emerald-700">Setup Profile</h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full border rounded-lg px-3 py-2"
        />

        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full border rounded-lg px-3 py-2 resize-none"
          rows={3}
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Save Profile
        </button>
      </form>
    </main>
  );
}
