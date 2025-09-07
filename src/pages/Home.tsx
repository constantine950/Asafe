import { Link } from "react-router";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-700">
          Àṣàfé
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          The offline-first hyper app for communities. Share posts, sync when
          online, and stay connected even without internet.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            to="/feed"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            Enter App
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-emerald-600 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-10">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="font-semibold text-lg text-emerald-700">
            Offline-first
          </h3>
          <p className="mt-2 text-gray-600">
            Create and read posts even without internet. Sync automatically once
            you’re back online.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="font-semibold text-lg text-emerald-700">
            Fast & Local
          </h3>
          <p className="mt-2 text-gray-600">
            Built for speed in low-connectivity regions. Everything feels
            instant and responsive.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="font-semibold text-lg text-emerald-700">
            Community Focused
          </h3>
          <p className="mt-2 text-gray-600">
            Àṣàfé is your local network for sharing knowledge, stories, and
            opportunities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Àṣàfé. Built for communities.
      </footer>
    </main>
  );
}
