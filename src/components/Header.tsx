import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { LogOut, Moon } from "lucide-react";

const Header: React.FC = () => {
  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/";
    } else {
      console.error(error);
      alert("Logout failed. Try again.");
    }
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        {/* App Title */}
        <h1 className="text-lg sm:text-xl font-bold text-emerald-700">
          Àṣàfé Feed
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Home link */}
          <Link to="/" className="text-sm text-emerald-600 hover:underline">
            Home
          </Link>

          {/* Dark mode icon (no functionality yet) */}
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Toggle theme"
          >
            <Moon size={16} className="text-gray-700" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
