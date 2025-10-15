import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b shadow-sm z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-emerald-700">Àṣàfé Feed</h1>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-emerald-600 hover:underline">
            ← Home
          </Link>
        </div>
      </div>
    </header>
  );
}
