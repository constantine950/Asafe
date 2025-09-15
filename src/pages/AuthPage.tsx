import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return alert(error.message);
      navigate("/profile-setup");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert(error.message);
      alert("✅ Account created, please log in!");
      setIsLogin(true);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-emerald-700">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 hover:underline"
          >
            {isLogin ? "Create account" : "Login"}
          </button>
        </p>
      </form>
    </main>
  );
}
